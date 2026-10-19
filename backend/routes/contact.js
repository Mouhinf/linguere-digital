const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');
const { contactLimiter, contactLimiterByEmail } = require('../middleware/rateLimiter');
const router = express.Router();

// Apply both IP-based limiter and email-keyed limiter
router.post('/', contactLimiter, contactLimiterByEmail, [
  // Bornes de longueur : empêchent le stockage de charges utiles volumineuses
  // et plafonnent l'entrée du parseur d'adresses de Nodemailer (cf. advisories
  // addressparser, non corrigeables sans Node >= 20 — voir package.json).
  body('prenom').trim().notEmpty().withMessage('Prénom requis')
    .isLength({ max: 80 }).withMessage('Prénom trop long'),
  body('nom').trim().notEmpty().withMessage('Nom requis')
    .isLength({ max: 80 }).withMessage('Nom trop long'),
  body('email').trim().isEmail().withMessage('Email invalide')
    .isLength({ max: 254 }).withMessage('Email trop long')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('telephone').optional({ checkFalsy: true }).trim()
    .isLength({ max: 32 }).withMessage('Téléphone trop long'),
  body('service').optional({ checkFalsy: true }).trim()
    .isLength({ max: 80 }).withMessage('Service invalide'),
  body('objet').trim().notEmpty().withMessage('Objet requis')
    .isLength({ max: 150 }).withMessage('Objet trop long'),
  body('message').trim().notEmpty().withMessage('Message requis')
    .isLength({ max: 5000 }).withMessage('Message trop long')
], submitContact);

module.exports = router;
