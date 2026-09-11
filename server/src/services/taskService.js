const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Task = require('../models/Task');
const User = require('../models/User');
const { getPaginationOptions, formatPaginationMeta } = require('../utils/pagination');
const { sendTaskAssignedEmail, sendTaskStatusUpdatedEmail } = require('./emailService');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Get tasks with server-side search, filtering, and pagination.
 * ADMIN: Can see all tasks, search matches title/description/employee name/email.
 * EMPLOYEE: Can see only their assigned tasks, search matches title/description.
 */
const getTasks = async (currentUser, query) => {
  const { page, limit, skip } = getPaginationOptions(query);
  const { search, status, priority } = query;

  const filter = {};

  // Role scoping: Employee only sees own tasks
  if (currentUser.role === 'EMPLOYEE') {
    filter.assignedTo = currentUser._id;
  }

  // Filter by status if provided
  if (status) {
    filter.status = status;
  }

  // Filter by priority if provided
  if (priority) {
    filter.priority = priority;
  }

  // Server-side search
  if (search && search.trim().length > 0) {
    const searchRegex = new RegExp(search.trim(), 'i');

    if (currentUser.role === 'ADMIN') {
      // Find matching employee IDs by name or email
      const matchedUsers = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }).select('_id');
      const matchedUserIds = matchedUsers.map((u) => u._id);

      // Search across task title, description, and assigned employee name/email
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { assignedTo: { $in: matchedUserIds } },
      ];
    } else {
      // Employee searches their own task titles and descriptions
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
  }

  const [total, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  const pagination = formatPaginationMeta(total, page, limit);

  return {
    tasks,
    pagination,
  };
};

/**
 * Create a new task (ADMIN only).
 * Dispatches fire-and-log email to assigned employee.
 */
const createTask = async (currentUser, taskData) => {
  // Verify assigned employee exists and has EMPLOYEE role (or valid user)
  const employee = await User.findById(taskData.assignedTo);
  if (!employee) {
    throw new AppError('The specified employee does not exist', 404);
  }

  const task = await Task.create({
    ...taskData,
    createdBy: currentUser._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email');

  // Trigger fire-and-log email to employee
  sendTaskAssignedEmail({
    toEmail: employee.email,
    employeeName: employee.name,
    adminName: currentUser.name,
    taskId: populatedTask._id,
    taskTitle: populatedTask.title,
    description: populatedTask.description,
    priority: populatedTask.priority,
    status: populatedTask.status,
  });

  return populatedTask;
};

/**
 * Get a single task by ID.
 * ADMIN can access any task.
 * EMPLOYEE can access only their own task.
 */
const getTaskById = async (currentUser, taskId) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Ownership check
  if (currentUser.role === 'EMPLOYEE' && task.assignedTo._id.toString() !== currentUser._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  return task;
};

/**
 * Update task details (ADMIN only).
 */
const updateTask = async (currentUser, taskId, updateData) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // If assignedTo is being updated, verify target employee
  let assignedEmployee = null;
  if (updateData.assignedTo && updateData.assignedTo !== task.assignedTo.toString()) {
    assignedEmployee = await User.findById(updateData.assignedTo);
    if (!assignedEmployee) {
      throw new AppError('The reassigned employee does not exist', 404);
    }
  }

  Object.assign(task, updateData);
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email');

  // If assignedTo changed, notify the newly assigned employee
  if (assignedEmployee) {
    sendTaskAssignedEmail({
      toEmail: assignedEmployee.email,
      employeeName: assignedEmployee.name,
      adminName: currentUser.name,
      taskId: updatedTask._id,
      taskTitle: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      status: updatedTask.status,
    });
  }

  return updatedTask;
};

/**
 * Update task status.
 * ADMIN can update any task's status.
 * EMPLOYEE can update only their own task's status.
 * If employee updates status, fire-and-log email notification is dispatched to admin(s).
 */
const updateTaskStatus = async (currentUser, taskId, newStatus) => {
  const task = await Task.findById(taskId).populate('assignedTo', 'name email role');
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Ownership check
  if (currentUser.role === 'EMPLOYEE' && task.assignedTo._id.toString() !== currentUser._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  const previousStatus = task.status;
  task.status = newStatus;
  await task.save();
  console.log('[Task] Status updated successfully');

  const updatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email');

  let emailSent = false;

  // If updated by an employee, notify administrator via email
  if (currentUser.role === 'EMPLOYEE' && previousStatus !== newStatus) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin.taskflow@gmail.com';

    try {
      const emailResult = await sendTaskStatusUpdatedEmail({
        adminEmail,
        employeeName: currentUser.name,
        taskTitle: task.title,
        taskId: task._id,
        previousStatus,
        newStatus,
        updatedAt: new Date(),
      });
      emailSent = Boolean(emailResult && emailResult.success);
    } catch (emailError) {
      // Database update persists even if email delivery encounters an error
      console.error('[EmailService] Failed to send task status notification');
      console.error(`[EmailService] ${emailError.message}`);
      emailSent = false;
    }
  }

  return {
    task: updatedTask,
    emailSent,
  };
};

/**
 * Delete task (ADMIN only).
 */
const deleteTask = async (currentUser, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await Task.findByIdAndDelete(taskId);
  return { id: taskId };
};

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
