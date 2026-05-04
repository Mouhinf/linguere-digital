const express = require('express');
const { BlogPost } = require('../config/database').models;

const router = express.Router();

// GET all published posts
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const posts = await BlogPost.findAll({
      where: { publie: true },
      order: [['createdAt', 'DESC']],
      limit,
      attributes: { exclude: ['contenu'] }
    });
    res.json(posts);
  } catch (error) {
    console.error('Blog error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single post with increment views
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post || !post.publie) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    post.vues += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Blog post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
