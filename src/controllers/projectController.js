const projectService = require('../services/projectService');
const catchAsync = require('../utils/catchAsync');

const projectController = {
  createProject: catchAsync(async (req, res) => {
    const project = await projectService.createProject(req.user.id, req.body);

    res.status(201).json({
      status: 'success',
      data: { project }
    });
  }),

  getProjects: catchAsync(async (req, res) => {
    const projects = await projectService.getProjects(req.user.id, req.query);

    res.json({
      status: 'success',
      results: projects.length,
      data: { projects }
    });
  }),

  getProjectById: catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await projectService.getProjectById(id, req.user.id);

    res.json({
      status: 'success',
      data: { project }
    });
  }),

  updateProject: catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await projectService.updateProject(id, req.user.id, req.body);

    res.json({
      status: 'success',
      data: { project }
    });
  }),

  deleteProject: catchAsync(async (req, res) => {
    const { id } = req.params;
    await projectService.deleteProject(id, req.user.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }),

  addMember: catchAsync(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    const project = await projectService.addMember(id, req.user.id, email);

    res.json({
      status: 'success',
      data: { project }
    });
  })
};

module.exports = projectController;

