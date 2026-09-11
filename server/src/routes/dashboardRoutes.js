const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/admin: ADMIN only
router.get('/admin', authorize('ADMIN'), dashboardController.getAdminDashboard);

// GET /api/dashboard/employee: EMPLOYEE only
router.get('/employee', authorize('EMPLOYEE'), dashboardController.getEmployeeDashboard);

module.exports = router;
