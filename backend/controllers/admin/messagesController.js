const { Message } = require('../../config/database').models;

const getAll = async (req, res) => {
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
};

const getOne = async (req, res) => {
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
};

const markAsRead = async (req, res) => {
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
};

const remove = async (req, res) => {
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
};

module.exports = { getAll, getOne, markAsRead, remove };