const express = require('express');
const { body } = require('express-validator');
const { submitContact } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/', contactLimiter, [
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('objet').trim().notEmpty().withMessage('Objet requis'),
  body('message').trim().notEmpty().withMessage('Message requis')
], submitContact);

module.exports = router;
