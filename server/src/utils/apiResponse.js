/**
 * Standard API response helper utilities
 */

const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...meta,
  };
  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, data = [], pagination = {}) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: pagination.totalPages || 0,
    },
  });
};

const errorResponse = (res, statusCode = 500, message = 'An error occurred', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
};
