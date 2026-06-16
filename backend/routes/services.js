const express = require('express');
const { sequelize, Service } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { actif: true }
    });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch services' } });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: { message: 'Service not found' } });
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch service' } });
  }
});

module.exports = router;
