#!/usr/bin/env bash
# ============================================================
#  Déploiement Linguère Digital — cPanel (hébergement mutualisé)
#
#  Corrige trois défauts de la version précédente :
#   1. `git reset --hard origin/main` — la branche du dépôt est `master`.
#      Avec `set -e`, l'étape 1 échouait et TOUT le déploiement s'arrêtait :
#      c'est la raison pour laquelle la production est restée figée (et pour
#      laquelle services.html n'est jamais arrivé sur le serveur).
#   2. `.htaccess` n'était pas copié (le glob `*.html` ne le capture pas),
#      donc les en-têtes de sécurité n'arrivaient jamais en production.
#   3. PM2 n'est pas le mécanisme réellement utilisé : la production tourne
#      via le watchdog cron `backend/start-linguere.sh` (nohup + node).
# ============================================================
set -euo pipefail

REPO_DIR="${REPO_DIR:-$HOME/linguere-digital}"
PUBLIC_DIR="${PUBLIC_DIR:-$HOME/public_html}"
BACKEND_DIR="$REPO_DIR/backend"
API_PORT="${API_PORT:-3000}"
WATCHDOG="$BACKEND_DIR/start-linguere.sh"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "=== Déploiement Linguère Digital ==="

# ---------- 1. Mise à jour du code ----------
echo "[1/6] Git pull..."
cd "$REPO_DIR"
git fetch origin
# Branche par défaut détectée dynamiquement (master ici), plus de « main » codé en dur.
BRANCH="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|^origin/||' || true)"
if [ -z "$BRANCH" ]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
fi
echo "      branche déployée : $BRANCH"
git reset --hard "origin/$BRANCH"

# ---------- 2. Frontend ----------
echo "[2/6] Copie frontend vers public_html..."
mkdir -p "$PUBLIC_DIR"
cp -f "$REPO_DIR/frontend/"*.html "$PUBLIC_DIR/"
cp -f "$REPO_DIR/frontend/robots.txt" "$PUBLIC_DIR/"
cp -f "$REPO_DIR/frontend/sitemap.xml" "$PUBLIC_DIR/"
for d in css js services admin assets; do
  rm -rf "$PUBLIC_DIR/$d/$d"
  mkdir -p "$PUBLIC_DIR/$d"
  cp -rf "$REPO_DIR/frontend/$d/." "$PUBLIC_DIR/$d/"
done
rm -f "$PUBLIC_DIR/error_log"

# .htaccess et proxy.php : copiés explicitement et le port du proxy API y est substitué.
sed "s/PORT_PLACEHOLDER/$API_PORT/g" "$REPO_DIR/frontend/.htaccess" > "$PUBLIC_DIR/.htaccess"
sed "s/PORT_PLACEHOLDER/$API_PORT/g" "$REPO_DIR/frontend/proxy.php" > "$PUBLIC_DIR/proxy.php"
echo "      .htaccess et proxy.php déployés (proxy API → 127.0.0.1:$API_PORT)"

# ---------- 3. Contrôle de complétude ----------
echo "[3/6] Vérification des fichiers déployés..."
MISSING=0
for f in index.html services.html about.html contact.html realisations.html blog.html 404.html \
         services/informatique.html services/data-science.html services/marketing.html \
         services/formation.html .htaccess proxy.php robots.txt sitemap.xml; do
  if [ ! -f "$PUBLIC_DIR/$f" ]; then
    echo "      MANQUANT : $f"
    MISSING=$((MISSING + 1))
  fi
done
if [ "$MISSING" -gt 0 ]; then
  echo "      ÉCHEC : $MISSING fichier(s) manquant(s) — déploiement interrompu."
  exit 1
fi
echo "      OK — toutes les pages attendues sont présentes."

# ---------- 4. Backend ----------
echo "[4/6] Installation dépendances backend..."
cd "$BACKEND_DIR"
npm install --omit=dev --no-audit --no-fund

# ---------- 5. Redémarrage ----------
echo "[5/6] Redémarrage de l'API..."
chmod +x "$WATCHDOG" 2>/dev/null || true
if [ -f "$WATCHDOG" ]; then
  cp -f "$WATCHDOG" "$HOME/start-linguere.sh"
  chmod +x "$HOME/start-linguere.sh"
fi
# Le watchdog relance l'API si elle ne répond pas : on tue le process, il
# reprend la main. C'est le mécanisme réel en production (cron), pas PM2.
pkill -f "node.*server.js" 2>/dev/null || true
sleep 3
if [ -f "$WATCHDOG" ]; then
  bash "$WATCHDOG"
else
  echo "      watchdog absent, démarrage direct"
  NODE_ENV=production SERVE_FRONTEND=true \
    nohup node --max-old-space-size=256 server.js >> /tmp/linguere-api.log 2>&1 &
fi

# ---------- 6. Vérification post-déploiement ----------
echo "[6/6] Vérification post-déploiement..."
for i in $(seq 1 30); do
  if curl -sf -m 3 "http://localhost:$API_PORT/api/health" >/dev/null 2>&1; then
    echo "      API en ligne après ${i}s"
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "      ÉCHEC : API injoignable après 30s — voir /tmp/linguere-api.log"
    exit 1
  fi
done

BASE="https://lingueredigital.com"
echo "      --- contrôles publics ---"
printf '      %-46s %s\n' "/services.html (doit être 200)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/services.html")"
printf '      %-46s %s\n' "/404.html (doit être 200)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/404.html")"
printf '      %-46s %s\n' "/api/health (doit être 200)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/api/health")"
printf '      %-46s %s\n' "/api/services (doit être 200)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/api/services")"
printf '      %-46s %s\n' "/url-inexistante-xyz (doit être 404)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/url-inexistante-xyz")"
printf '      %-46s %s\n' "/wp-login.php (doit être 404)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/wp-login.php")"
printf '      %-46s %s\n' "/proxy.php (doit être 404)" "$(curl -so /dev/null -w '%{http_code}' -m 15 "$BASE/proxy.php")"
printf '      %-46s %s\n' "/api/auth/register (doit être 404)" "$(curl -so /dev/null -w '%{http_code}' -m 15 -X POST -H 'Content-Type: application/json' -d '{}' "$BASE/api/auth/register")"
echo "      --- en-têtes de sécurité ---"
curl -sI -m 15 "$BASE/" | grep -iE 'strict-transport|content-security|x-content-type|x-frame|referrer-policy|permissions-policy' \
  | sed 's/^/      /' || echo "      AUCUN en-tête détecté — vérifier mod_headers"

echo "=== Déploiement terminé ==="
