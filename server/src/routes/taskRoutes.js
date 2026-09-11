const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  validateBody,
  validateQuery,
  validateObjectIdParam,
} = require('../middleware/validationMiddleware');
const {
  createTaskSchema,
  updateTaskSchema,
  statusUpdateSchema,
} = require('../validators/taskValidator');
const { paginationQuerySchema } = require('../validators/queryValidator');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// GET /api/tasks: ADMIN sees all, EMPLOYEE sees own only
router.get('/', validateQuery(paginationQuerySchema), taskController.getTasks);

// POST /api/tasks: ADMIN only
router.post(
  '/',
  authorize('ADMIN'),
  validateBody(createTaskSchema),
  taskController.createTask
);

// GET /api/tasks/:id: ADMIN any, EMPLOYEE own only
router.get(
  '/:id',
  validateObjectIdParam('id'),
  taskController.getTaskById
);

// PATCH /api/tasks/:id: ADMIN only
router.patch(
  '/:id',
  authorize('ADMIN'),
  validateObjectIdParam('id'),
  validateBody(updateTaskSchema),
  taskController.updateTask
);

// PATCH /api/tasks/:id/status: ADMIN any, EMPLOYEE own only
router.patch(
  '/:id/status',
  validateObjectIdParam('id'),
  validateBody(statusUpdateSchema),
  taskController.updateTaskStatus
);

// DELETE /api/tasks/:id: ADMIN only
router.delete(
  '/:id',
  authorize('ADMIN'),
  validateObjectIdParam('id'),
  taskController.deleteTask
);

module.exports = router;
