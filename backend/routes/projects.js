const express = require('express');
const { Project } = require('../config/database').models;

const router = express.Router();

// GET all published projects
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const projects = await Project.findAll({
      where: { publie: true },
      order: [['dateProjets', 'DESC']],
      limit
    });
    res.json(projects);
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project || !project.publie) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Project error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
