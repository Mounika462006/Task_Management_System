const Task = require('../models/Task');
const User = require('../models/User');

/**
 * Get Admin dashboard metrics.
 * Shape: totalTasks, notStarted, inProgress, completed, totalEmployees (+ recentTasks, priorityBreakdown)
 */
const getAdminDashboard = async () => {
  const [totalEmployees, taskStats, priorityStats, recentTasks] = await Promise.all([
    User.countDocuments({ role: 'EMPLOYEE' }).catch(() => 0),
    Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          notStarted: {
            $sum: { $cond: [{ $eq: ['$status', 'NOT_STARTED'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
          },
        },
      },
    ]).catch(() => []),
    Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]).catch(() => []),
    Task.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .catch(() => []),
  ]);

  const stats = (Array.isArray(taskStats) && taskStats[0]) || {
    totalTasks: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
  };

  const priorityBreakdown = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0,
  };
  if (Array.isArray(priorityStats)) {
    priorityStats.forEach((p) => {
      if (p && priorityBreakdown[p._id] !== undefined) {
        priorityBreakdown[p._id] = p.count;
      }
    });
  }

  return {
    totalTasks: stats.totalTasks || 0,
    notStarted: stats.notStarted || 0,
    inProgress: stats.inProgress || 0,
    completed: stats.completed || 0,
    totalEmployees: totalEmployees || 0,
    priorityBreakdown,
    recentTasks: Array.isArray(recentTasks) ? recentTasks : [],
  };
};

/**
 * Get Employee dashboard metrics.
 * Same shape, scoped to that employee's own tasks.
 */
const getEmployeeDashboard = async (employeeId) => {
  const [taskStats, priorityStats, recentTasks] = await Promise.all([
    Task.aggregate([
      { $match: { assignedTo: employeeId } },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          notStarted: {
            $sum: { $cond: [{ $eq: ['$status', 'NOT_STARTED'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'IN_PROGRESS'] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] },
          },
        },
      },
    ]).catch(() => []),
    Task.aggregate([
      { $match: { assignedTo: employeeId } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]).catch(() => []),
    Task.find({ assignedTo: employeeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .catch(() => []),
  ]);

  const stats = (Array.isArray(taskStats) && taskStats[0]) || {
    totalTasks: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
  };

  const priorityBreakdown = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    URGENT: 0,
  };
  if (Array.isArray(priorityStats)) {
    priorityStats.forEach((p) => {
      if (p && priorityBreakdown[p._id] !== undefined) {
        priorityBreakdown[p._id] = p.count;
      }
    });
  }

  return {
    totalTasks: stats.totalTasks || 0,
    notStarted: stats.notStarted || 0,
    inProgress: stats.inProgress || 0,
    completed: stats.completed || 0,
    totalEmployees: null,
    priorityBreakdown,
    recentTasks: Array.isArray(recentTasks) ? recentTasks : [],
  };
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};
