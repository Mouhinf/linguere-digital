const rateLimit = require('express-rate-limit');

// `app.set('trust proxy', 1)` est actif en production (server.js), donc `req.ip`
// reflète déjà le X-Forwarded-For de Cloudflare / du reverse proxy cPanel.
const clientIp = (req) => req.ip;

const bodyEmail = (req) => {
  try {
    const email = req?.body?.email;
    return email ? String(email).toLowerCase().trim() : '';
  } catch (e) {
    return '';
  }
};

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per IP
  message: 'Trop de demandes depuis cette adresse IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false
});

// Additional limiter keyed by submitted email (helps when attacker rotates IPs)
const contactLimiterByEmail = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour per email
  message: 'Trop de demandes pour cet email, veuillez réessayer plus tard.',
  keyGenerator: (req) => bodyEmail(req) || clientIp(req),
  standardHeaders: true,
  legacyHeaders: false
});

// Anti-force brute sur le login, par IP.
// `skipSuccessfulRequests` : seules les tentatives ratées sont comptées, donc un
// administrateur légitime n'est jamais bloqué par ses propres connexions.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: 'Trop de tentatives de connexion depuis cette adresse, réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false
});

// Second verrou, par email visé : empêche le bourrinage d'un compte précis
// par un attaquant qui change d'adresse IP à chaque essai.
const authLimiterByEmail = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => bodyEmail(req) || clientIp(req),
  message: 'Trop de tentatives de connexion pour ce compte, réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  contactLimiter,
  contactLimiterByEmail,
  authLimiter,
  authLimiterByEmail
};
