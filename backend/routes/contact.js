const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');
const { contactLimiter, contactLimiterByEmail } = require('../middleware/rateLimiter');
const router = express.Router();

// Apply both IP-based limiter and email-keyed limiter
router.post('/', contactLimiter, contactLimiterByEmail, [
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('objet').trim().notEmpty().withMessage('Objet requis'),
  body('message').trim().notEmpty().withMessage('Message requis')
], submitContact);

module.exports = router;
