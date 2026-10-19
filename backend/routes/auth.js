const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { sequelize, User } = require('../config/database');
const { authLimiter, authLimiterByEmail } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// LOGIN
router.post('/login', authLimiter, authLimiterByEmail, [
  body('email').trim().notEmpty().withMessage('Email requis'),
  body('password').trim().notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: { message: errors.array()[0].msg } });

    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(401).json({ error: { message: 'Email ou mot de passe invalide' } });

    if (!await user.verifyPassword(req.body.password)) {
      return res.status(401).json({ error: { message: 'Email ou mot de passe invalide' } });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h', algorithm: 'HS256' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: { message: 'Erreur d\'authentification' } });
  }
});

// INSCRIPTION PUBLIQUE : VOLONTAIREMENT ABSENTE
// L'ancienne route POST /register faisait `User.create(req.body)` sans filtrer
// les champs : un corps `{email, password, role:"admin"}` créait un compte
// administrateur complet, sans authentification. Le site n'a aucun parcours
// d'inscription (aucun appel côté frontend) : la route est donc retirée.
// Les comptes se créent via `npm run seed` ou en base, jamais par l'API publique.

// VERIFY TOKEN
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ error: { message: 'Token invalide' } });
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(401).json({ error: { message: 'Token invalide' } });
  }
});

// PROTECTED ROUTE
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: { message: 'Utilisateur non trouvé' } });
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: { message: 'Erreur de profil' } });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie' });
});

module.exports = router;
