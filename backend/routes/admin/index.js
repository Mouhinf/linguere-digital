const express = require('express');
const { verifyToken, requireAdmin } = require('../../middleware/auth');

const router = express.Router();

// Protect all admin routes
router.use(verifyToken, requireAdmin);

// Profile
router.use('/profile', require('./profile'));

// Stats
router.use('/stats', require('./stats'));

// Resources CRUD
router.use('/services', require('./services'));
router.use('/projects', require('./projects'));
router.use('/blog', require('./blog'));
router.use('/testimonials', require('./testimonials'));

// Messages
router.use('/messages', require('./messages'));

// Settings
router.use('/settings', require('./settings'));

module.exports = router;
