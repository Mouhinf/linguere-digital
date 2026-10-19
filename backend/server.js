require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const { sequelize, syncDatabase } = require('./config/database');
const { buildHelmetOptions } = require('./config/security');
const { createNotFoundHandler } = require('./middleware/notFound');

// Heartbeat: write every 30s so the watchdog knows the server is alive.
// Without this, the watchdog (cron) can't distinguish a healthy server
// from a hung one and may kill a healthy server.
setInterval(() => {
  try { fs.writeFileSync('/tmp/linguere-heartbeat', new Date().toISOString()); } catch (e) {}
}, 30 * 1000);

// Log but EXIT on fatal errors — otherwise a zombie process survives
// without listening and the watchdog can never recover. Log to stderr.
process.on('unhandledRejection', (reason) => {
  console.error('FATAL UNHANDLED REJECTION:', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('FATAL UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// Démarrage en échec rapide : sans JWT_SECRET, la signature et la vérification
// des jetons sont inopérantes. Mieux vaut refuser de démarrer que de tourner
// avec une authentification silencieusement cassée.
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET absent — démarrage refusé.');
  process.exit(1);
}
// Longueur seulement avertie, jamais bloquante : le secret actuellement en
// production fait 28 caractères et un exit() ici empêcherait le site de
// redémarrer. À faire tourner vers 64 caractères (voir DEPLOY.md), ce qui
// déconnectera les sessions admin en cours.
if (process.env.JWT_SECRET.length < 32) {
  console.warn(
    `⚠️  JWT_SECRET faible (${process.env.JWT_SECRET.length} caractères, 32 minimum recommandés) — à faire tourner.`
  );
}

const app = express();
// If the app runs behind a reverse proxy (Cloudflare, load balancer), trust proxy
// TRUST_PROXY can be set to a truthy value in env to enable. Default to '1' in production.
if (process.env.TRUST_PROXY === '1' || (process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY !== '0')) {
  app.set('trust proxy', 1);
  console.log('⚙️  Trusting proxy headers (trust proxy = 1)');
}
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const servesFrontend = isProduction || process.env.SERVE_FRONTEND === 'true';

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
].filter(Boolean);

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.SITE_DOMAIN) {
  allowedOrigins.push(`https://${process.env.SITE_DOMAIN}`);
  allowedOrigins.push(`http://${process.env.SITE_DOMAIN}`);
}

// Security headers — CSP, HSTS et Referrer-Policy (voir config/security.js).
// Auparavant : `helmet({ contentSecurityPolicy: false })`, donc aucune CSP.
app.use(helmet(buildHelmetOptions({ isProduction })));

// Allow ngrok host header (dev tunnel)
app.use((req, res, next) => {
  const allowedHosts = [
    'localhost',
    '127.0.0.1',
    process.env.SITE_DOMAIN,
    process.env.NGROK_HOST,
  ].filter(Boolean);
  const reqHost = req.hostname;
  if (!allowedHosts.some(h => reqHost === h || reqHost.endsWith('.' + h))) {
    return res.status(403).send('Blocked request. Host not allowed.');
  }
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: isProduction ? allowedOrigins : true,
  credentials: true
}));

// Static files (only when frontend is served from same server, e.g. local/cPanel)
if (servesFrontend) {
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

  // Explicit routes for SEO files — must come BEFORE the SPA fallback
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').sendFile(path.join(__dirname, '../frontend/robots.txt'));
  });
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml').sendFile(path.join(__dirname, '../frontend/sitemap.xml'));
  });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/services', require('./routes/services'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  const now = new Date().toISOString();
  try { fs.writeFileSync('/tmp/linguere-heartbeat', now); } catch (e) {}
  res.json({ status: 'ok', timestamp: now });
});

// Seed endpoint — protected: only works in development or with SEED_TOKEN
app.post('/api/seed', async (req, res) => {
  // SEED_TOKEN est exigé quel que soit l'environnement : si NODE_ENV n'est pas
  // positionné (oubli au démarrage), l'ancienne version laissait n'importe qui
  // réinitialiser la base — et donc les identifiants administrateur.
  if (!process.env.SEED_TOKEN) {
    return res.status(403).json({ error: 'Seeding disabled (SEED_TOKEN not set)' });
  }
  if (req.query.token !== process.env.SEED_TOKEN) {
    return res.status(403).json({ error: 'Invalid seed token' });
  }
  try {
    const { seedDatabase } = require('./seeders/seed');
    await seedDatabase();
    res.json({ status: 'ok', message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vrai 404 (remplace l'ancien fallback vers index.html en HTTP 200)
app.use(createNotFoundHandler({ servesFrontend }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: isProduction ? 'Internal server error' : err.message
  });
});

// Start server
syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 API ready at http://localhost:${PORT}/api`);
    if (isProduction) {
      console.log(`🌐 Production mode — frontend served separately`);
    }
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});
