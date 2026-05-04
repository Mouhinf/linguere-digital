const { validationResult } = require('express-validator');
const { Service } = require('../../config/database').models;

const getAll = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['ordre', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    await service.update(req.body);
    res.json(service);
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    await service.destroy();
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Service deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, create, update, remove };