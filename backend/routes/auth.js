const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { sequelize } = require('../config/database');
const { User } = require('../config/database').models;
const { authLimiter } = require('../middleware/rateLimiter');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    
    if (!user || !await user.verifyPassword(req.body.password)) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: user.toJSON() });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client-side only, but keep endpoint for consistency)
router.post('/logout', verifyToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Change password
router.put('/password', verifyToken, [
  body('oldPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByPk(req.user.id);
    
    if (!await user.verifyPassword(req.body.oldPassword)) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
