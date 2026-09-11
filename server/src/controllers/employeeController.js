const employeeService = require('../services/employeeService');

/**
 * GET /api/employees (ADMIN only)
 */
const getEmployees = async (req, res, next) => {
  try {
    const employees = await employeeService.getEmployees();
    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/employees/:id (ADMIN only)
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const result = await employeeService.getEmployeeById(req.params.id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/employees (ADMIN only)
 */
const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.createEmployee(req.body);
    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/employees/:id (ADMIN only)
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/employees/:id (ADMIN only)
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
