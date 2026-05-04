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
