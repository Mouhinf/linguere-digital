const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per IP
  message: 'Trop de demandes depuis cette adresse IP, veuillez réessayer plus tard.',
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
  authLimiter
};
