const express = require('express');
const { sequelize, Project } = require('../config/database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const projects = await Project.findAll({
      where: { publie: true },
      limit: limit,
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch projects' } });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: { message: 'Project not found' } });
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch project details' } });
  }
});

module.exports = router;
