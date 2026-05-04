const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { Message } = require('../config/database').models;
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Configure Nodemailer
let transporter;
if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== 'your-email@gmail.com') {
  // Real SMTP transporter
  transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  // Mock transporter for development
  transporter = {
    sendMail: async (options) => {
      console.log('📧 Mock email:', options);
      return { response: 'ok' };
    }
  };
}

// POST contact form
router.post('/', contactLimiter, [
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('telephone').optional().trim(),
  body('objet').trim().notEmpty().withMessage('Objet requis'),
  body('message').trim().notEmpty().isLength({ min: 10 }).withMessage('Message minimum 10 caractères'),
  body('honeypot').isEmpty() // Anti-spam
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check honeypot field (should be empty)
    if (req.body.honeypot) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    const message = await Message.create({
      prenom: req.body.prenom,
      nom: req.body.nom,
      email: req.body.email,
      telephone: req.body.telephone,
      service: req.body.service,
      budget: req.body.budget,
      objet: req.body.objet,
      message: req.body.message,
      statut: 'nouveau'
    });

    // Send confirmation email to client
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@lingueredigital.com',
      to: req.body.email,
      subject: 'Confirmation - Linguère Digital Innovation',
      html: `
        <h2>Merci de votre message!</h2>
        <p>Nous avons bien reçu votre demande et vous recontacterons sous peu.</p>
        <p><strong>Référence:</strong> #${message.id}</p>
        <p>Cordialement,<br>L'équipe Linguère Digital</p>
      `
    });

    // Send notification email to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@lingueredigital.com',
      to: process.env.ADMIN_EMAIL || 'linguere660@gmail.com',
      subject: `Nouveau message - ${req.body.objet}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${req.body.prenom} ${req.body.nom}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Téléphone:</strong> ${req.body.telephone || 'Non fourni'}</p>
        <p><strong>Service:</strong> ${req.body.service || 'Non spécifié'}</p>
        <p><strong>Budget:</strong> ${req.body.budget || 'Non spécifié'}</p>
        <p><strong>Objet:</strong> ${req.body.objet}</p>
        <p><strong>Message:</strong></p>
        <p>${req.body.message.replace(/\n/g, '<br>')}</p>
      `
    });

    res.status(201).json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      id: message.id 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
