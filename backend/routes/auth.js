const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { sequelize, User } = require('../config/database');
const { authLimiter } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// LOGIN
router.post('/login', authLimiter, [
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

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: { message: 'Erreur d\'authentification' } });
  }
});

// REGISTER
router.post('/register', authLimiter, [
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password').trim().notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: { message: errors.array()[0].msg } });

    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) return res.status(409).json({ error: { message: 'Email déjà utilisé' } });

    const user = await User.create(req.body);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registry error:', error);
    res.status(500).json({ error: { message: 'Erreur d\'inscription' } });
  }
});

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
