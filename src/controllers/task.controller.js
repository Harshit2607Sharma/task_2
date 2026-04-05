const Task = require('../models/Task.model');

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      dueDate,
      status: status || 'pending',
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: not your task' });
    }

    res.status(200).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: not your task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: not your task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };