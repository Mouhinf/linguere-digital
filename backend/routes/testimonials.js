const express = require('express');
const { Testimonial } = require('../config/database').models;

const router = express.Router();

// GET all approved testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { approuve: true },
      order: [['ordre', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(testimonials);
  } catch (error) {
    console.error('Testimonials error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
