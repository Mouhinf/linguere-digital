const { validationResult } = require('express-validator');
const { BlogPost } = require('../../config/database').models;

const getAll = async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (error) {
    console.error('Blog error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Blog post creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.update(req.body);
    res.json(post);
  } catch (error) {
    console.error('Blog post update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Blog post deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, create, update, remove };