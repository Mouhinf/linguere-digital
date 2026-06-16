const express = require('express');
const { sequelize, Testimonial } = require('../config/database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const testimonials = await Testimonial.findAll({
      where: { approuve: true },
      limit: limit
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Testimonials error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch testimonials' } });
  }
});

router.post('/', async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Testimonial error:', error);
    res.status(500).json({ error: { message: 'Failed to create testimonial' } });
  }
});

module.exports = router;
