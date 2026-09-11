const express = require('express');
const employeeController = require('../controllers/employeeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validateBody,
  validateObjectIdParam,
} = require('../middleware/validationMiddleware');
const { createEmployeeSchema, updateEmployeeSchema } = require('../validators/authValidator');

const router = express.Router();

// All employee routes require authentication + ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/', employeeController.getEmployees);
router.post('/', validateBody(createEmployeeSchema), employeeController.createEmployee);
router.get('/:id', validateObjectIdParam('id'), employeeController.getEmployeeById);
router.put(
  '/:id',
  validateObjectIdParam('id'),
  validateBody(updateEmployeeSchema),
  employeeController.updateEmployee
);
router.delete('/:id', validateObjectIdParam('id'), employeeController.deleteEmployee);

module.exports = router;
