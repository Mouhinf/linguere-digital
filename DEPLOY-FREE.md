# Déploiement Gratuit — Linguère Digital (Revue Expert)

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Netlify (Frontend) │  ────▶  │   Render (Backend)   │
│ linguere-digital     │  API    │ linguere-backend     │
│ .netlify.app         │ calls   │ .onrender.com/api    │
└─────────────────────┘         └─────────────────────┘
```

## Étape 1 : Pousser sur GitHub

```bash
cd /home/mouhammad/linguere-digital

# Créer le repo sur GitHub (ex: linguere-digital)
git branch -m main
git add .
git commit -m "feat: complete project with deploy config"
git remote add origin https://github.com/VOTRE_USERNAME/linguere-digital.git
git push -u origin main
```

## Étape 2 : Déployer le Backend sur Render

1. Aller sur [render.com](https://render.com) → Sign Up (gratuit)
2. **New → Web Service** → Connecter le repo GitHub
3. Configuration :
   - **Name** : `linguere-backend`
   - **Root Directory** : `backend`
   - **Build Command** : `npm install --production`
   - **Start Command** : `node server.js`
   - **Environment** : `Node`
4. **Variables d'environnement** (dans le dashboard Render) :
   ```
   NODE_ENV=production
   DB_DIALECT=sqlite
   PORT=3000
   JWT_SECRET=<générer 64 caractères aléatoires>
   FRONTEND_URL=https://linguere-digital.netlify.app  (mettre après étape 3)
   ADMIN_EMAIL=linguere660@gmail.com
   SEED_TOKEN=<générer un token aléatoire pour le seed>
   ```
5. Cliquer **Create Web Service**
6. Attendre le déploiement (~2-3 min)
7. Noter l'URL : `https://linguere-backend.onrender.com`

## Étape 3 : Déployer le Frontend sur Netlify

### Option A : Drag & Drop (le plus simple)
1. Aller sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisser le dossier `frontend/` entier
3. Netlify donne une URL : `https://linguere-digital-xxxx.netlify.app`

### Option B : Via GitHub (recommandé pour les mises à jour)
1. Aller sur [netlify.com](https://netlify.com) → Sign Up (gratuit)
2. **Add new site → Import an existing project** → GitHub
3. Configuration :
   - **Base directory** : (vide)
   - **Build command** : (vide)
   - **Publish directory** : `frontend`
4. Cliquer **Deploy site**
5. Noter l'URL : `https://linguere-digital-xxxx.netlify.app`

## Étape 4 : Connecter Frontend → Backend

### 4a. Mettre à jour l'URL API dans le frontend

Modifier `frontend/js/api.js` — la ligne `API_BASE` détecte automatiquement
si on est en production (pas localhost) et utilise `/api` en relatif.

**Pour Netlify** (frontend séparé du backend), il faut pointer vers Render.
Ajouter un fichier `frontend/js/config.js` :

```javascript
// URL du backend Render — mettre à jour après déploiement
window.LINGUERE_API_URL = 'https://linguere-backend.onrender.com/api';
```

Ou plus simple : modifier directement la ligne 2 de `api.js` :
```javascript
const API_BASE = window.LINGUERE_API_URL || 'https://linguere-backend.onrender.com/api';
```

### 4b. Mettre à jour CORS du backend

Dans le dashboard Render, ajouter la variable :
```
FRONTEND_URL=https://linguere-digital-xxxx.netlify.app
```

Le serveur la lit automatiquement et l'ajoute aux origines CORS autorisées.

### 4c. Redéployer

```bash
git add frontend/js/api.js
git commit -m "chore: update API URL for production"
git push
```

Netlify et Render redéploient automatiquement depuis GitHub.

## Étape 5 : Seeder les données

Une fois le backend Render déployé, exécuter le seed :

```bash
# Via curl (remplacer le token et l'URL)
curl -X POST "https://linguere-backend.onrender.com/api/seed?token=VOTRE_SEED_TOKEN"
```

Ou depuis le dashboard Render → Shell :
```bash
npm run seed
```

**Credentials admin après seed :**
- Email : `admin@lingueredigital.com`
- Password : `Admin@2025`

## Étape 6 : Vérifier

```bash
# Frontend
curl -I https://linguere-digital-xxxx.netlify.app

# Backend health
curl https://linguere-backend.onrender.com/api/health

# API publique
curl https://linguere-backend.onrender.com/api/services
curl https://linguere-backend.onrender.com/api/testimonials
```

## URLs à partager à l'expert

- **Frontend** : `https://linguere-digital-xxxx.netlify.app`
- **Admin** : `https://linguere-digital-xxxx.netlify.app/admin/login.html`
- **Backend API** : `https://linguere-backend.onrender.com/api/health`
- **Repo GitHub** : `https://github.com/VOTRE_USERNAME/linguere-digital`

## Limites des plans gratuits

| Service | Limite | Impact |
|---------|--------|--------|
| Render  | 750h/mois, sleep après 15min d'inactivité | Premier chargement lent (~30s) |
| Netlify | 100GB bandwidth/mois | Largement suffisant pour une démo |

## Pour le déploiement cPanel final

Voir `DEPLOY.md` pour les instructions cPanel complètes.
