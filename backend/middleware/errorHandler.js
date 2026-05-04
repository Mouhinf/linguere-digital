const express = require('express');
const router = express.Router();

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
};

// 404 handler
router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Attach error handler
router.use(errorHandler);

module.exports = router;
