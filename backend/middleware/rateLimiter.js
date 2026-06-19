const rateLimit = require('express-rate-limit');

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
  keyGenerator: (req) => {
    try {
      const email = (req && req.body && req.body.email) ? String(req.body.email).toLowerCase() : '';
      return email || req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    } catch (e) {
      return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Trop de tentatives de connexion, réessayez plus tard.'
});

module.exports = {
  contactLimiter,
  contactLimiterByEmail,
  authLimiter
};
