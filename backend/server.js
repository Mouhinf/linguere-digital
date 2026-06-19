require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { sequelize, syncDatabase } = require('./config/database');

const app = express();
// If the app runs behind a reverse proxy (Cloudflare, load balancer), trust proxy
// TRUST_PROXY can be set to a truthy value in env to enable. Default to '1' in production.
if (process.env.TRUST_PROXY === '1' || (process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY !== '0')) {
  app.set('trust proxy', 1);
  console.log('⚙️  Trusting proxy headers (trust proxy = 1)');
}
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

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

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

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
if (isProduction || process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed endpoint — protected: only works in development or with SEED_TOKEN
app.post('/api/seed', async (req, res) => {
  if (isProduction && !process.env.SEED_TOKEN) {
    return res.status(403).json({ error: 'Seeding disabled in production' });
  }
  if (isProduction && req.query.token !== process.env.SEED_TOKEN) {
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

// Fallback to index.html for frontend routing (only when serving frontend)
if (isProduction || process.env.SERVE_FRONTEND === 'true') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

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
