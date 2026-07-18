import { ApiError } from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Translates known failure shapes into safe client responses. Unknown errors
 * are logged in full but reported generically so internals never leak.
 *
 * The unused `_next` is required: Express identifies an error handler by its
 * arity, and a 3-argument function is treated as ordinary middleware.
 */
export const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed', details);
  } else if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid identifier: ${err.value}`);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || { field: '' })[0];
    error = ApiError.conflict(`A record with that ${field} already exists`);
  }

  if (!(error instanceof ApiError)) {
    logger.error(err.stack || err);
    error = new ApiError(500, 'Something went wrong. Please try again.');
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
