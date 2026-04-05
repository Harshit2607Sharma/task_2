const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty',
  }),
  description: Joi.string().trim().allow('').optional(),
  dueDate: Joi.date().iso().required().messages({
    'date.format': 'Due date must be ISO format: YYYY-MM-DD',
    'any.required': 'Due date is required',
  }),
  status: Joi.string().valid('pending', 'completed').optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().allow('').optional(),
  dueDate: Joi.date().iso().optional().messages({
    'date.format': 'Due date must be ISO format: YYYY-MM-DD',
  }),
  status: Joi.string().valid('pending', 'completed').optional(),
}).min(1); // At least one field required for update

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, errors });
  }
  next();
};

module.exports = { createTaskSchema, updateTaskSchema, validate };