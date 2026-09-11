const dashboardService = require('../services/dashboardService');

/**
 * GET /api/dashboard/admin (ADMIN only)
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getAdminDashboard();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/employee (EMPLOYEE only)
 */
const getEmployeeDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getEmployeeDashboard(req.user._id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};
