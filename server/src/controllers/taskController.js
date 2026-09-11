const taskService = require('../services/taskService');

/**
 * GET /api/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user, req.query);
    return res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks (ADMIN only)
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user, req.body);
    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user, req.params.id);
    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id (ADMIN only)
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user, req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/status (ADMIN any | EMPLOYEE own only)
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { task, emailSent } = await taskService.updateTaskStatus(req.user, req.params.id, req.body.status);
    const message = emailSent
      ? 'Task status updated successfully. Admin notification sent.'
      : 'Task status updated successfully.';

    return res.status(200).json({
      success: true,
      message,
      data: task,
      emailSent: Boolean(emailSent),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id (ADMIN only)
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.user, req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
