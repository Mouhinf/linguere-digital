const express = require('express');
const { Settings } = require('../config/database');

const router = express.Router();

router.get('/:categorie', async (req, res) => {
  try {
    const settings = await Settings.findAll({
      where: { categorie: req.params.categorie }
    });
    const result = {};
    settings.forEach(s => {
      result[s.cle] = s.valeur;
    });
    res.json(result);
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;