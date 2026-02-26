const Joi = require('joi');

const taskValidation = {
  create: Joi.object({
    title: Joi.string().required().min(3).max(100),
    description: Joi.string().max(500).optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').default('MEDIUM'),
    dueDate: Joi.date().iso().min('now').optional(),
    assigneeId: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED').optional(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
    dueDate: Joi.date().iso().optional().allow(null),
    assigneeId: Joi.string().optional().allow(null)
  }).min(1)
};

module.exports = taskValidation;

