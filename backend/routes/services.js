const express = require('express');
const { Service } = require('../config/database').models;

const router = express.Router();

// GET all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { actif: true },
      order: [['ordre', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
