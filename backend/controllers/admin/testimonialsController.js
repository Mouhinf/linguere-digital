const { validationResult } = require('express-validator');
const { Testimonial } = require('../../config/database').models;

const getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      order: [['ordre', 'ASC']]
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Testimonial creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    await testimonial.update(req.body);
    res.json(testimonial);
  } catch (error) {
    console.error('Testimonial update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    await testimonial.destroy();
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Testimonial deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, create, update, remove };