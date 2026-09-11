const mongoose = require('mongoose');

/**
 * Validate request body against a Zod schema.
 * Returns structured 422 with per-field messages on failure.
 */
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  req.body = result.data;
  next();
};

/**
 * Validate request query parameters against a Zod schema.
 * Returns structured 422 with per-field messages on failure.
 */
const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Query parameter validation failed',
      errors: formattedErrors,
    });
  }
  req.query = result.data;
  next();
};

/**
 * Validates that a route param (e.g. :id) is a valid MongoDB ObjectId.
 * Returns 400 Bad Request if malformed, preventing Mongoose CastError.
 */
const validateObjectIdParam = (paramName = 'id') => (req, res, next) => {
  const idValue = req.params[paramName];
  if (!idValue || !mongoose.Types.ObjectId.isValid(idValue)) {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: '${idValue}'. Must be a 24-character hex string.`,
    });
  }
  next();
};

module.exports = {
  validateBody,
  validateQuery,
  validateObjectIdParam,
};
