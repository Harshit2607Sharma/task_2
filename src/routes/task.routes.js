const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { createTaskSchema, updateTaskSchema, validate } = require('../validators/task.validator');

// All task routes require authentication
router.use(authMiddleware);

// POST   /api/tasks          - Create a task
router.post('/', validate(createTaskSchema), createTask);

// GET    /api/tasks          - Get all tasks for current user
router.get('/', getTasks);

// GET    /api/tasks/:id      - Get single task by ID
router.get('/:id', getTaskById);

// PATCH  /api/tasks/:id      - Partially update a task
router.patch('/:id', validate(updateTaskSchema), updateTask);

// DELETE /api/tasks/:id      - Delete a task
router.delete('/:id', deleteTask);

module.exports = router;