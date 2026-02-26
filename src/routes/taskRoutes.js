const express = require('express');
const Joi = require('joi');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const taskValidation = require('../validations/taskValidation');

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/projects/:projectId/tasks',
  validate(taskValidation.create),
  taskController.createTask
);

router.get(
  '/projects/:projectId/tasks',
  taskController.getTasks
);

router.get(
  '/tasks/:taskId',
  taskController.getTaskById
);

router.patch(
  '/tasks/:taskId',
  validate(taskValidation.update),
  taskController.updateTask
);

router.delete(
  '/tasks/:taskId',
  taskController.deleteTask
);

router.post(
  '/tasks/:taskId/comments',
  validate(Joi.object({ content: Joi.string().required().min(1).max(500) })),
  taskController.addComment
);

module.exports = router;

