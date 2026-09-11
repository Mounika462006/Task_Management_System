const User = require('../models/User');
const Task = require('../models/Task');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Get list of all employees with their assigned task counts (ADMIN only).
 */
const getEmployees = async () => {
  const employees = await User.find({ role: 'EMPLOYEE' })
    .select('-password')
    .sort({ createdAt: -1 })
    .lean();

  // Aggregate task counts per employee
  const employeeIds = employees.map((e) => e._id);
  const taskStats = await Task.aggregate([
    { $match: { assignedTo: { $in: employeeIds } } },
    {
      $group: {
        _id: '$assignedTo',
        total: { $sum: 1 },
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
  ]);

  const statsMap = {};
  taskStats.forEach((stat) => {
    statsMap[stat._id.toString()] = stat;
  });

  const employeesWithStats = employees.map((emp) => {
    const stats = statsMap[emp._id.toString()] || {
      total: 0,
      notStarted: 0,
      inProgress: 0,
      completed: 0,
    };
    return {
      ...emp,
      taskStats: {
        total: stats.total,
        notStarted: stats.notStarted,
        inProgress: stats.inProgress,
        completed: stats.completed,
      },
    };
  });

  return employeesWithStats;
};

/**
 * Get employee details by ID along with their tasks (ADMIN only).
 */
const getEmployeeById = async (employeeId) => {
  const employee = await User.findOne({ _id: employeeId, role: 'EMPLOYEE' })
    .select('-password')
    .lean();

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const tasks = await Task.find({ assignedTo: employeeId })
    .sort({ createdAt: -1 })
    .lean();

  const taskStats = {
    total: tasks.length,
    notStarted: tasks.filter((t) => t.status === 'NOT_STARTED').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return {
    employee,
    taskStats,
    tasks,
  };
};

/**
 * Create a new employee through secure auth flow (ADMIN only).
 */
const createEmployee = async (employeeData) => {
  const email = employeeData.email.toLowerCase().trim();

  // 1. Check email uniqueness
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError('A user with this email address already exists', 409);
  }

  // 2. Check username uniqueness if provided
  let username = employeeData.username ? employeeData.username.toLowerCase().trim() : undefined;
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new AppError('An employee with this username already exists', 409);
    }
  } else {
    // Generate default username from name or email prefix if not supplied
    const base = employeeData.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'emp';
    const rand = Math.floor(100 + Math.random() * 900);
    username = `${base}${rand}`;
  }

  // 3. Check employeeId uniqueness if provided
  let employeeId = employeeData.employeeId ? employeeData.employeeId.trim() : undefined;
  if (employeeId) {
    const existingEmpId = await User.findOne({ employeeId });
    if (existingEmpId) {
      throw new AppError('An employee with this Employee ID already exists', 409);
    }
  } else {
    // Generate an automatic Employee ID if not supplied (e.g. EMP-104)
    const count = await User.countDocuments({ role: 'EMPLOYEE' });
    employeeId = `EMP-${String(count + 1).padStart(3, '0')}`;
  }

  const newEmployee = await User.create({
    name: employeeData.name.trim(),
    email,
    password: employeeData.password, // hashed automatically by User pre-save hook
    role: 'EMPLOYEE',
    employeeId,
    username,
    phone: employeeData.phone ? employeeData.phone.trim() : '',
    department: employeeData.department ? employeeData.department.trim() : 'Engineering',
    designation: employeeData.designation ? employeeData.designation.trim() : 'Team Member',
    dateOfJoining: employeeData.dateOfJoining ? new Date(employeeData.dateOfJoining) : new Date(),
    status: employeeData.status || 'ACTIVE',
    emailVerified: true,
  });

  return {
    _id: newEmployee._id,
    name: newEmployee.name,
    email: newEmployee.email,
    role: newEmployee.role,
    employeeId: newEmployee.employeeId,
    username: newEmployee.username,
    phone: newEmployee.phone,
    department: newEmployee.department,
    designation: newEmployee.designation,
    dateOfJoining: newEmployee.dateOfJoining,
    status: newEmployee.status,
    createdAt: newEmployee.createdAt,
  };
};

/**
 * Update an existing employee (ADMIN only).
 */
const updateEmployee = async (employeeIdParam, updateData) => {
  const employee = await User.findOne({ _id: employeeIdParam, role: 'EMPLOYEE' });
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  // Email check
  if (updateData.email && updateData.email.toLowerCase().trim() !== employee.email) {
    const normalizedEmail = updateData.email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: employee._id } });
    if (existing) {
      throw new AppError('This email is already in use by another account', 409);
    }
    employee.email = normalizedEmail;
  }

  // Username check
  if (updateData.username && updateData.username.toLowerCase().trim() !== employee.username) {
    const normalizedUsername = updateData.username.toLowerCase().trim();
    const existing = await User.findOne({ username: normalizedUsername, _id: { $ne: employee._id } });
    if (existing) {
      throw new AppError('This username is already in use by another account', 409);
    }
    employee.username = normalizedUsername;
  }

  // EmployeeId check
  if (updateData.employeeId && updateData.employeeId.trim() !== employee.employeeId) {
    const trimmedEmpId = updateData.employeeId.trim();
    const existing = await User.findOne({ employeeId: trimmedEmpId, _id: { $ne: employee._id } });
    if (existing) {
      throw new AppError('This Employee ID is already assigned to another account', 409);
    }
    employee.employeeId = trimmedEmpId;
  }

  if (updateData.name) employee.name = updateData.name.trim();
  if (updateData.phone !== undefined) employee.phone = updateData.phone.trim();
  if (updateData.department) employee.department = updateData.department.trim();
  if (updateData.designation) employee.designation = updateData.designation.trim();
  if (updateData.dateOfJoining) employee.dateOfJoining = new Date(updateData.dateOfJoining);
  if (updateData.status) employee.status = updateData.status;

  // Optional password update
  if (updateData.password && updateData.password.length >= 6) {
    employee.password = updateData.password; // pre-save will hash
  }

  await employee.save();

  return {
    _id: employee._id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    employeeId: employee.employeeId,
    username: employee.username,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    dateOfJoining: employee.dateOfJoining,
    status: employee.status,
    updatedAt: employee.updatedAt,
  };
};

/**
 * Delete an employee (ADMIN only).
 */
const deleteEmployee = async (employeeIdParam) => {
  const employee = await User.findOne({ _id: employeeIdParam, role: 'EMPLOYEE' });
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  // Cleanly unassign any tasks assigned to this employee
  await Task.updateMany({ assignedTo: employee._id }, { $unset: { assignedTo: 1 } });

  await User.deleteOne({ _id: employee._id });

  return { success: true, message: 'Employee deleted successfully' };
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
