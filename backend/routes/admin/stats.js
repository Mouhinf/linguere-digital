const express = require('express');
const { Message, Service, Project, BlogPost } = require('../../config/database').models;
const { sequelize } = require('../../config/database');

const router = express.Router();

// GET stats
router.get('/', async (req, res) => {
  try {
    const [messages, unreadMessages, services, projects, articles] = await Promise.all([
      Message.count(),
      Message.count({ where: { lu: false } }),
      Service.count({ where: { actif: true } }),
      Project.count({ where: { publie: true } }),
      BlogPost.count({ where: { publie: true } })
    ]);

    res.json({
      messages,
      unreadMessages,
      services,
      projects,
      articles
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET messages by month chart data
router.get('/messages-par-mois', async (req, res) => {
  try {
    const data = await Message.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'DESC']],
      raw: true,
      subQuery: false,
      limit: 12
    });
    res.json(data);
  } catch (error) {
    console.error('Messages chart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET projects by category chart data
router.get('/projets-par-categorie', async (req, res) => {
  try {
    const data = await Project.findAll({
      attributes: [
        'categorie',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['categorie'],
      raw: true,
      subQuery: false
    });
    res.json(data);
  } catch (error) {
    console.error('Projects chart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
