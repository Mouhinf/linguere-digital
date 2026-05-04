const express = require('express');
const { Message } = require('../../config/database').models;

const router = express.Router();

// GET all messages
router.get('/', async (req, res) => {
  try {
    const status = req.query.status;
    const where = status ? { statut: status } : {};
    
    const messages = await Message.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single message
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    message.lu = true;
    message.statut = 'lu';
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    await message.destroy();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Message deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
