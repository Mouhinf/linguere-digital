const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const { Message } = require('../config/database').models;

let transporter;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  const transportConfig = {
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };
  if (process.env.SMTP_HOST) {
    transportConfig.host = process.env.SMTP_HOST;
    transportConfig.port = parseInt(process.env.SMTP_PORT || '465', 10);
    transportConfig.secure = process.env.SMTP_SECURE === 'true';
  } else {
    transportConfig.service = process.env.SMTP_SERVICE || 'gmail';
  }
  transporter = nodemailer.createTransport(transportConfig);
} else {
  transporter = {
    sendMail: async (options) => {
      console.log('📧 Mock email:', options);
      return { response: 'ok' };
    }
  };
}

const submitContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.body.honeypot) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  let message;
  try {
    message = await Message.create({
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
  } catch (error) {
    console.error('Contact DB error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }

  res.status(201).json({
    success: true,
    message: 'Message envoyé avec succès',
    id: message.id
  });

  const msgText = req.body.message.replace(/\n/g, '<br>');

  transporter.sendMail({
    from: '"Linguère Digital" <contact@lingueredigital.com>',
    to: process.env.ADMIN_EMAIL || 'mouhopap@gmail.com',
    subject: 'Nouveau message depuis le site web',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0077B6,#00B4D8);padding:24px 32px;">
          <h2 style="margin:0;color:#fff;font-size:20px;">Nouveau message depuis le site web</h2>
        </div>
        <div style="padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;font-weight:600;width:120px;">Prénom</td><td style="padding:8px 0;color:#0f172a;">${req.body.prenom}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-weight:600;">Nom</td><td style="padding:8px 0;color:#0f172a;">${req.body.nom}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-weight:600;">Email</td><td style="padding:8px 0;color:#0f172a;">${req.body.email}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-weight:600;">Téléphone</td><td style="padding:8px 0;color:#0f172a;">${req.body.telephone || 'Non fourni'}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-weight:600;">Service</td><td style="padding:8px 0;color:#0f172a;">${req.body.service || 'Non spécifié'}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-weight:600;">Objet</td><td style="padding:8px 0;color:#0f172a;">${req.body.objet}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;">
            <div style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Message</div>
            <div style="color:#0f172a;line-height:1.6;white-space:pre-wrap;">${msgText}</div>
          </div>
          <div style="margin-top:16px;font-size:12px;color:#94a3b8;">Reçu le ${new Date().toLocaleString('fr-FR', {timeZone:'Africa/Dakar'})} — Réf: #${message.id}</div>
        </div>
      </div>`
  }).catch(err => console.error('Email admin notification error:', err.message));

  transporter.sendMail({
    from: '"Linguère Digital" <contact@lingueredigital.com>',
    to: req.body.email,
    subject: 'Confirmation - Linguère Digital Innovation',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#0077B6,#00B4D8);padding:24px 32px;">
          <h2 style="margin:0;color:#fff;font-size:20px;">Merci de votre message !</h2>
        </div>
        <div style="padding:24px 32px;">
          <p style="color:#0f172a;line-height:1.6;">Bonjour <strong>${req.body.prenom}</strong>,</p>
          <p style="color:#0f172a;line-height:1.6;">Nous avons bien reçu votre demande et vous recontacterons dans les plus brefs délais.</p>
          <p style="color:#64748b;font-size:14px;"><strong>Référence :</strong> #${message.id}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
          <p style="color:#94a3b8;font-size:13px;">Cordialement,<br><strong style="color:#0077B6;">L'équipe Linguère Digital</strong></p>
        </div>
      </div>`
  }).catch(err => console.error('Email confirmation error:', err.message));
};

module.exports = { submitContact };