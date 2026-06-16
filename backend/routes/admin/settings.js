const express = require('express');
const { Settings: Setting } = require('../../config/database');

const router = express.Router();

// GET settings by category
router.get('/:categorie', async (req, res) => {
  try {
    console.log('Getting settings for category:', req.params.categorie);
    const settings = await Setting.findAll({
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

// PUT update settings
router.put('/:categorie', async (req, res) => {
  try {
    const categorie = req.params.categorie;
    
    for (const [cle, valeur] of Object.entries(req.body)) {
      await Setting.upsert({
        categorie,
        cle,
        valeur: typeof valeur === 'string' ? valeur : JSON.stringify(valeur)
      });
    }
    
    const settings = await Setting.findAll({
      where: { categorie }
    });
    const result = {};
    settings.forEach(s => {
      result[s.cle] = s.valeur;
    });
    res.json(result);
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
