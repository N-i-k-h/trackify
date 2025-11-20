const express = require('express');
const Task = require('../models/Task');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { user: req.user._id };

    // Filter by status if provided
    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
      query.status = status;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Create a new task
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'pending',
      user: req.user._id,
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined && ['pending', 'in-progress', 'completed'].includes(status)) {
      task.status = status;
    }

    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;

