const express = require('express');
const { body } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getTaskStats);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  ],
  createTask
);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

module.exports = router;
