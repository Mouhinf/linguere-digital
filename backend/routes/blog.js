const express = require('express');
const { sequelize, BlogPost } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const posts = await BlogPost.findAll({
      where: { publie: true },
      limit: limit,
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Blog error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch blog posts' } });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: { message: 'Post not found' } });
    res.json({ success: true, data: post });
  } catch (error) {
    console.error('Blog error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch blog post' } });
  }
});

module.exports = router;
