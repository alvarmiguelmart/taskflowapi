const taskService = require('../services/taskService');
const catchAsync = require('../utils/catchAsync');

const taskController = {
  createTask: catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const task = await taskService.createTask(
      req.user.id,
      projectId,
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: { task }
    });
  }),

  getTasks: catchAsync(async (req, res) => {
    const { projectId } = req.params;
    const tasks = await taskService.getTasks(
      req.user.id,
      projectId,
      req.query
    );

    res.json({
      status: 'success',
      results: tasks.length,
      data: { tasks }
    });
  }),

  getTaskById: catchAsync(async (req, res) => {
    const { taskId } = req.params;
    const task = await taskService.getTaskById(taskId, req.user.id);

    res.json({
      status: 'success',
      data: { task }
    });
  }),

  updateTask: catchAsync(async (req, res) => {
    const { taskId } = req.params;
    const task = await taskService.updateTask(
      taskId,
      req.user.id,
      req.body
    );

    res.json({
      status: 'success',
      data: { task }
    });
  }),

  deleteTask: catchAsync(async (req, res) => {
    const { taskId } = req.params;
    await taskService.deleteTask(taskId, req.user.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  }),

  addComment: catchAsync(async (req, res) => {
    const { taskId } = req.params;
    const comment = await taskService.addComment(
      taskId,
      req.user.id,
      req.body.content
    );

    res.status(201).json({
      status: 'success',
      data: { comment }
    });
  })
};

module.exports = taskController;

