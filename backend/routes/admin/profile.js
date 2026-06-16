const express = require('express');
const { User } = require('../../config/database').models;
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.put('/', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { nom, prenom, email, password } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (password) user.password = password;

    await user.save();

    res.json({ message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;