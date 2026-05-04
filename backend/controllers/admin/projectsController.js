const { validationResult } = require('express-validator');
const { Project } = require('../../config/database').models;

const getAll = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [['dateProjets', 'DESC']]
    });
    res.json(projects);
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    console.error('Project update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Project deletion error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAll, create, update, remove };