#!/bin/bash
# Watchdog linguere-api — ROBUSTE pour environnement cron (cPanel jailshell)
# Points critiques :
#   - `$HOME` est VIDE dans le cron → ne jamais dépendre de NVM ou de $HOME
#   - `ss` est dans /usr/sbin → ABSENT du PATH cron → utiliser `curl` (dans /usr/bin)
#   - `node` → chemin ABSOLU (indépendant du PATH)
NODE_BIN="/home2/lingu269/.nvm/versions/node/v18.20.8/bin/node"

LOG="/tmp/linguere-watchdog.log"
APP_DIR="/home2/lingu269/linguere-digital/backend"

log() { echo "$(date) $*" >> "$LOG"; }

# ✅ Si l'API répond → serveur sain → ne RIEN faire (exit 0, jamais tuer un serveur sain)
if curl -sf -m 5 http://localhost:3000/api/health >/dev/null 2>&1; then
  exit 0
fi

log "API down — restarting..."

# Tuer proprement les éventuels restes (zombies, processus coincés)
pkill -f "node.*server.js" 2>/dev/null
sleep 3

cd "$APP_DIR"
NODE_ENV=production SERVE_FRONTEND=true nohup "$NODE_BIN" --max-old-space-size=256 server.js >> /tmp/linguere-api.log 2>&1 &

# Attendre activement que l'API réponde (démarrage DB sync ~8-10s, max 30s)
for i in $(seq 1 30); do
  sleep 1
  if curl -sf -m 2 http://localhost:3000/api/health >/dev/null 2>&1; then
    date -u +"%Y-%m-%dT%H:%M:%SZ" > /tmp/linguere-heartbeat
    log "✅ API healthy after ${i}s"
    exit 0
  fi
done

log "❌ API still down after 30s — see /tmp/linguere-api.log"
