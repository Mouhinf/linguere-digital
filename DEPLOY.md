# Guide de Déploiement - Linguère Digital Innovation

## 🚀 Déploiement sur cPanel

### Prérequis
- Hébergement cPanel avec Node.js support
- Accès FTP/SFTP
- MySQL database
- SSL Certificate (Let's Encrypt)

### Étape 1: Préparation Base de Données

1. **cPanel → MySQL Databases**
   - Créer nouvelle base: `linguere_prod`
   - Créer utilisateur: `linguere_user`
   - Assigner utilisateur à la base
   - Noter: host (localhost), user, password

2. **Mettre à jour .env.production**
```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=linguere_prod
DB_USER=linguere_user
DB_PASSWORD=your_secure_password
DB_DIALECT=mysql

JWT_SECRET=generate_64_char_random_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=linguere660@gmail.com
```

### Étape 2: Upload Backend

1. **Via FTP/SFTP** (vers `/home/username/`)
```
Upload:
  - backend/
  - node_modules/ (optionnel, npm install sur serveur)
  - package.json
  - .env.production
```

2. **Depuis le serveur, installer dépendances**
```bash
cd ~/backend
npm install --production
npm run seed  # Initialiser données
```

### Étape 3: Configuration Node.js

1. **cPanel → Setup Node.js App**
   - Application Root: `/home/username/backend`
   - Application URL: `your_domain.com`
   - Application Startup File: `server.js`
   - Node Version: 18+ recommandé
   - Cliquer "Create"

2. Note le port assigné (ex: 8765)

3. **cPanel → Reverse Proxy**
   - Route `/api` vers `http://127.0.0.1:8765`

### Étape 4: Upload Frontend

1. **Via FTP** (vers `public_html/`)
```
Upload:
  - *.html (tous les fichiers HTML)
  - css/ (tous les fichiers CSS)
  - js/ (tous les fichiers JS)
  - assets/ (logos, images)
  - admin/ (pages admin)
```

2. **Créer .htaccess** (pour routing SPA)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# Cache Headers
<FilesMatch "\.(jpg|jpeg|png|gif|css|js|svg)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Étape 5: SSL Certificate

1. **cPanel → AutoSSL** (Let's Encrypt)
   - Vérifier domaine active dans "Addon Domains"
   - AutoSSL s'applique automatiquement (gratuit)

### Étape 6: Tester Déploiement

1. **Frontend**
   ```
   https://your_domain.com
   https://your_domain.com/about.html
   https://your_domain.com/contact.html
   https://your_domain.com/admin/login.html
   ```

2. **API**
   ```
   curl https://your_domain.com/api/health
   curl https://your_domain.com/api/services
   curl https://your_domain.com/api/testimonials
   ```

3. **Contact Form Test**
   - Remplir et envoyer
   - Vérifier email notification
   - Vérifier enregistrement BDD
   - Admin Dashboard → Messages devrait montrer

4. **Admin Login**
   - Email: admin@lingueredigital.com
   - Password: Admin@2025 (CHANGER après!)
   - Dashboard accessible?
   - CRUD services/projets fonctionnent?

### Étape 7: Configuration Post-Déploiement

1. **Sécurité**
   - Changer mot de passe admin
   - Mettre à jour JWT_SECRET (64 chars)
   - Vérifier CORS whitelist (seulement domaine)
   - Rate limiting activé sur contact form

2. **Email**
   - Configurer Nodemailer avec vrai SMTP
   - Tester envoi notification contact
   - Tester confirmation email client

3. **Monitoring**
   - cPanel → Error Logs (backend errors)
   - cPanel → Access Logs (traffic analysis)
   - Setup backup automatique BDD

## 📊 Commandes Utiles

```bash
# SSH/Terminal cPanel
npm start              # Redémarrer app
npm run seed          # Regénérer données démo
node -v               # Vérifier version Node

# Vérifier processus
ps aux | grep node

# Logs
tail -f /home/username/.pm2/logs/*.log
```

## 🆘 Troubleshooting

### App ne démarre pas
- Vérifier .env.production (permissions 600)
- Check: `npm install` complète
- Vérifier port disponible
- Regarder logs cPanel

### DB connexion error
- Vérifier credentials .env
- Test MySQL depuis cPanel
- Vérifier database/user créé
- Relancer Node app

### CORS errors
- Vérifier frontend/js/api.js base URL
- Ajouter domaine prod à CORS whitelist
- Vérifier reverse proxy config

### Email pas envoyé
- Vérifier SMTP credentials
- Activer "Less secure apps" si Gmail
- Check spam folder
- Vérifier logs backend

## 💡 Optimisations Supplémentaires

### Performance
1. Minify CSS/JS (avant upload)
2. Compress images
3. Enable GZIP (déjà dans .htaccess)
4. CDN pour assets (Cloudflare free)

### Sécurité
1. Firewall (cPanel Imunify360)
2. Fail2Ban pour brute-force
3. Update Node.js régulièrement
4. Audit permissions fichiers (644/755)

### Backup
```bash
# Cron job quotidien
0 2 * * * mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > /home/username/backups/db_$(date +\%Y\%m\%d).sql
```

## 📞 Support Déploiement

- Email: linguere660@gmail.com
- Vérifier logs avant contacter
- Fournir error message exact
- Inclure version Node et MySQL

---

*Dernier update: Mai 2025*

---

## 🔐 Déploiement du correctif de sécurité (octobre 2026)

Ce déploiement ferme une faille critique et corrige la raison pour laquelle la
production était restée figée pendant des mois. **À appliquer dans cet ordre.**

### Pourquoi la production ne se mettait plus à jour

`deploy.sh` faisait `git reset --hard origin/main` alors que la branche du dépôt
est `master`. Avec `set -euo pipefail`, l'étape 1 échouait et tout le script
s'arrêtait : aucun fichier n'était jamais copié. C'est aussi pourquoi
`services.html` n'existait pas sur le serveur (l'URL retombait sur la page
d'accueil). Le script détecte désormais la branche par défaut automatiquement.

### Procédure

```bash
# 1. Sur le serveur, via SSH cPanel
cd ~/linguere-digital
git fetch origin && git reset --hard origin/master

# 2. Lancer le déploiement (copie frontend + .htaccess, npm install, restart)
bash deploy.sh
```

`deploy.sh` vérifie lui-même, à la fin, que `/services.html` répond 200, que
`/wp-login.php` répond 404 et que les en-têtes de sécurité sont présents.

### Ce qui change en production

| Changement | Effet visible |
|---|---|
| Route `POST /api/auth/register` supprimée | Renvoie 404 — **elle permettait de créer un compte admin** |
| Plus de fallback vers `index.html` | Les URL inconnues renvoient un vrai 404 (`404.html`) |
| En-têtes de sécurité (`.htaccess` + helmet) | CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| `sqlite3` passé en devDependencies | `npm install --omit=dev` n'installe plus de module natif |
| Dépendances montées | 24 vulnérabilités → 2 |

### Deux actions manuelles restantes

**1. Faire tourner le secret JWT** (actuellement 28 caractères, 32 minimum
recommandés). Le serveur démarre quand même, avec un avertissement dans les logs.

```bash
# Génère un nouveau secret
openssl rand -base64 48
# Le reporter dans ~/linguere-digital/backend/.env (clé JWT_SECRET), puis
pkill -f "node.*server.js"   # le watchdog cron relance l'API dans la minute
```

> Conséquence : toutes les sessions admin ouvertes sont invalidées, il faut se
> reconnecter. Aucun impact sur le site public.

**2. Passer Node de 18 à 20+** pour pouvoir corriger la dernière vulnérabilité
`nodemailer` (la version 10.x, qui la corrige, exige Node ≥ 20).

```bash
source ~/.nvm/nvm.sh && nvm install 20 && nvm alias default 20
# Mettre à jour NODE_BIN dans backend/start-linguere.sh vers le nouveau chemin
cd ~/linguere-digital/backend && npm install nodemailer@^10
```

En attendant, le risque est contenu : l'adresse e-mail est validée
(`isEmail`) et bornée à 254 caractères avant d'atteindre le parseur.

### Vérification manuelle après déploiement

```bash
curl -o /dev/null -w '%{http_code}\n' https://lingueredigital.com/services.html      # 200
curl -o /dev/null -w '%{http_code}\n' https://lingueredigital.com/wp-login.php       # 404
curl -X POST -o /dev/null -w '%{http_code}\n' https://lingueredigital.com/api/auth/register  # 404
curl -sI https://lingueredigital.com/ | grep -i 'content-security-policy'            # présent
```
