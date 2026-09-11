/**
 * Pagination helper to compute skip, limit, and totalPages
 */
const getPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

const formatPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 0;
  return {
    page,
    limit,
    total,
    totalPages,
  };
};

module.exports = {
  getPaginationOptions,
  formatPaginationMeta,
};
