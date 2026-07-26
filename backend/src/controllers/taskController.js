const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sort, page = 1, limit = 50 } = req.query;

    const query = { userId: req.user._id };

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1 };
    if (sort === 'priority') sortOption = { priority: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    // Stats
    const stats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      tasks,
      total,
      stats: stats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0, highPriority: 0 },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Get task stats
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Task.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
        },
      },
    ]);

    // Weekly data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const created = await Task.countDocuments({ userId, createdAt: { $gte: start, $lte: end } });
      const completed = await Task.countDocuments({
        userId,
        status: 'Completed',
        updatedAt: { $gte: start, $lte: end },
      });

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weeklyData.push({
        day: dayNames[start.getDay()],
        created,
        completed,
      });
    }

    res.json({
      success: true,
      stats: stats[0] || { total: 0, completed: 0, pending: 0, inProgress: 0, highPriority: 0 },
      weeklyData,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, category, priority, status, dueDate } = req.body;

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      category: category || 'General',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate || null,
    });

    // Emit real-time event
    if (req.io) {
      req.io.to(`user-${req.user._id}`).emit('task-created', task);
    }

    res.status(201).json({ success: true, message: 'Task created successfully!', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, category, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    // Emit real-time event
    if (req.io) {
      req.io.to(`user-${req.user._id}`).emit('task-updated', task);
    }

    res.json({ success: true, message: 'Task updated successfully!', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Emit real-time event
    if (req.io) {
      req.io.to(`user-${req.user._id}`).emit('task-deleted', req.params.id);
    }

    res.json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskStats };
