const { z } = require('zod');

const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be an integer')
    .positive('Page must be greater than 0')
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be an integer')
    .positive('Limit must be greater than 0')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
  search: z.string().trim().optional(),
  status: z
    .enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ALL'])
    .optional()
    .transform((val) => (val === 'ALL' ? undefined : val)),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'ALL'])
    .optional()
    .transform((val) => (val === 'ALL' ? undefined : val)),
});

module.exports = {
  paginationQuerySchema,
};
