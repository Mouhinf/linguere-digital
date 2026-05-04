const express = require('express');
const router = express.Router();

// Public API routes
router.use('/auth', require('./auth'));
router.use('/contact', require('./contact'));
router.use('/services', require('./services'));
router.use('/projects', require('./projects'));
router.use('/blog', require('./blog'));
router.use('/testimonials', require('./testimonials'));

// Admin API routes
router.use('/admin', require('./admin'));

module.exports = router;
