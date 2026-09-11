const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(2000, 'Description cannot exceed 2000 characters'),
  assignedTo: z
    .string({ required_error: 'Assigned employee is required' })
    .regex(objectIdRegex, 'assignedTo must be a valid MongoDB ObjectId'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, HIGH, or URGENT' }),
  }),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(1, 'Description cannot be empty')
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, HIGH, or URGENT' }),
    })
    .optional(),
  assignedTo: z
    .string()
    .regex(objectIdRegex, 'assignedTo must be a valid MongoDB ObjectId')
    .optional(),
});

const statusUpdateSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'], {
    errorMap: () => ({ message: 'Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED' }),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  statusUpdateSchema,
  objectIdRegex,
};
