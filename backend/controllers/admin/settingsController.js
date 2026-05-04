const { Settings } = require('../../config/database').models;

const getSettings = async (req, res) => {
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
};

const updateSettings = async (req, res) => {
  try {
    const categorie = req.params.categorie;

    for (const [cle, valeur] of Object.entries(req.body)) {
      await Settings.upsert({
        categorie,
        cle,
        valeur: typeof valeur === 'string' ? valeur : JSON.stringify(valeur)
      });
    }

    const settings = await Settings.findAll({
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
};

module.exports = { getSettings, updateSettings };