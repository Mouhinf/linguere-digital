# Linguère Digital Innovation - Full Stack Site

**URL de Déploiement:** https://www.lingueredigital.com  
**Contact:** linguere660@gmail.com  
**Localisation:** Malika, Dakar, Sénégal

## 🚀 Stack Technologique

### Frontend
- **HTML5 + CSS3 (Custom)** - Zero Bootstrap/Tailwind
- **JavaScript Vanilla** - DOM API, Fetch, Intersection Observer
- **Design System:** HUD Sci-Fi + Glassmorphism + Aurora UI
- **Responsive:** Mobile-first (375px, 768px, 1024px, 1440px)
- **Performance:** Canvas animations, lazy loading, optimized assets

### Backend
- **Node.js + Express.js** - REST API
- **Sequelize ORM** - Database abstraction
- **SQLite (dev)** → **MySQL (prod)** - Database options
- **JWT (24h)** - Session authentication
- **Nodemailer** - Email notifications
- **Express Validator** - Input validation
- **Express Rate Limit** - DDoS protection

### Security
- Password hashing with bcryptjs
- CORS configuration
- Rate limiting (3 messages/IP/hour)
- Honeypot field for contact form
- JWT token expiration
- SQL injection prevention

## 📁 Structure du Projet

```
linguere-digital/
├── frontend/
│   ├── index.html, about.html, contact.html
│   ├── services.html, realisations.html, blog.html
│   ├── services/*.html (4 pages détaillées)
│   ├── css/
│   │   ├── variables.css (Design system)
│   │   ├── base.css, animations.css, components.css
│   │   ├── navbar.css, footer.css, responsive.css
│   │   └── home.css
│   ├── js/
│   │   ├── main.js, api.js, components.js
│   │   ├── animations.js, particles.js
│   │   └── pages/*.js
│   └── assets/
│
├── admin/
│   ├── login.html, dashboard.html
│   ├── services.html, projets.html, blog.html
│   ├── temoignages.html, messages.html, parametres.html
│   ├── css/ (admin-specific styles)
│   └── js/ (admin-specific logic)
│
├── backend/
│   ├── server.js (Express app)
│   ├── config/database.js (Sequelize)
│   ├── models/ (User, Message, Service, Project, BlogPost, Testimonial, Settings)
│   ├── middleware/ (auth, rateLimiter)
│   ├── routes/ (auth, contact, services, projects, blog, testimonials, admin)
│   ├── controllers/ (business logic)
│   ├── seeders/seed.js (demo data)
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── ngrok-share.sh / ngrok-share.bat
├── README.md
├── DEPLOY.md
└── .gitignore
```

## 🎯 Pages Publiques

### index.html (Accueil)
- Hero section avec canvas particles + typewriter effect
- Stats counter (count-up animation)
- Services preview (4 cartes)
- Pourquoi nous (4 arguments)
- Featured projects (carousel)
- Testimonials (rotation auto)
- Blog preview
- CTA final

### about.html (À Propos)
- Histoire + vision/mission
- Valeurs
- Équipe (3 personnes)
- Partenaires

### services.html (Services)
- Vue d'ensemble (4 cartes)
- Processus (4 étapes)
- Liens vers pages détaillées

### services/* (Détails)
- informatique.html
- data-science.html
- marketing.html
- formation.html

### realisations.html
- Filtres par catégorie
- Grille masonry 3 colonnes
- Modal détail au clic

### blog.html + blog-article.html
- Liste + recherche
- Pagination
- Article détail avec meta

### contact.html
- Formulaire (prénom, nom, email, tel, service, budget, objet, message)
- Honeypot field
- Validation front + back
- Email confirmation
- Support WhatsApp CTA

## 🔐 Pages Admin

### login.html
- Email + password
- Validation JWT
- Stockage token localStorage

### dashboard.html
- Stats (messages, non-lus, services, projets, articles)
- Liens vers gestion ressources
- Table derniers messages

### services.html, projets.html, blog.html
- CRUD complet
- Édition inline ou modale

### temoignages.html
- Validation avec sélecteur étoiles
- Toggle approbation

### messages.html
- Tableau filtrable
- Détail au clic
- Marquer lu / Supprimer
- Export CSV

### parametres.html
- 5 onglets (Profil, Entreprise, Réseaux, SEO, Système)

## 🔌 API Endpoints

```
PUBLIC:
POST   /api/auth/login
POST   /api/contact
GET    /api/services
GET    /api/projects
GET    /api/projects/:id
GET    /api/blog
GET    /api/blog/:id
GET    /api/testimonials

ADMIN (JWT Required):
GET    /api/admin/stats
POST   /api/admin/services, PUT /id, DELETE /id
POST   /api/admin/projects, PUT /id, DELETE /id
POST   /api/admin/blog, PUT /id, DELETE /id
POST   /api/admin/testimonials, PUT /id, DELETE /id
GET    /api/admin/messages, PATCH /id/read, DELETE /id
GET    /api/admin/settings/:category, PUT /id
```

## 🚀 Démarrage Local

### Backend
```bash
cd backend
npm install
npm run seed    # Create demo data
npm run dev     # or npm start
# Server: http://localhost:3000
```

### Frontend
```bash
cd frontend
npx live-server  # or any local server
# Access: http://localhost:8080
```

### Admin Login
- **Email:** admin@lingueredigital.com
- **Password:** Admin@2025

## 📊 Design System

### Palette de couleurs
- Primary: #00B4D8 (cyan)
- Secondary: #0077B6 (blue)
- Dark: #03045E (midnight)
- Surface: #080818 (dark gray)

### Typographie
- **Titres:** Orbitron (Google Fonts)
- **Corps:** Exo 2 (Google Fonts)
- **Responsive clamp:** hero 2.2-4.5rem, body 0.95-1.1rem

### Shadows & Effects
- Glow effect: rgba(0, 180, 216, 0.2) to 0.5
- Glass border: rgba(0, 180, 216, 0.2)
- Backdrop blur: 20px

### Animations
- fadeUp, fadeDown, fadeLeft, fadeRight
- scaleIn, scaleInSpring
- glowPulse, glowBorder, textGlow
- float, rotateSlow, aurora, shimmer, shake

## 🌐 Ngrok Share (Demo)

```bash
bash ngrok-share.sh  # Linux/Mac
ngrok-share.bat      # Windows
```

Génère un lien public HTTPS pour tester sans hébergement.

## 📦 Déploiement cPanel

1. **Prérequis:** cPanel, Node.js Selector, MySQL
2. **Base de données:** Créer DB MySQL
3. **Backend:** FTP → server.js + node_modules
4. **Frontend:** FTP → public_html
5. **SSL:** Let's Encrypt (gratuit)
6. **Node.js App:** Créer via cPanel (script: server.js)

Voir DEPLOY.md pour étapes détaillées.

## ✅ Checklist Finale

- ✅ Backend npm install + seed
- ✅ Formulaire contact: enregistrement BDD + email
- ✅ Admin login: JWT → dashboard
- ✅ CRUD services/projets/blog/témoignages
- ✅ Message contact → visible admin avec badge
- ✅ Responsive: 375px, 768px, 1024px, 1440px
- ✅ Zéro horizontal scroll
- ✅ Toutes variables CSS utilisées
- ✅ Animations prefers-reduced-motion respectées
- ✅ cursor:pointer sur éléments cliquables
- ✅ Contraste WCAG AA 4.5:1
- ✅ ngrok-share.sh fonctionne

## 📧 Support

Email: linguere660@gmail.com  
Téléphone: +221 77 612 60 31 / +221 78 660 24 24  
WhatsApp: https://wa.me/221786602424  
Site: www.lingueredigital.com

---

*Créé avec passion pour l'innovation africaine 🚀*
