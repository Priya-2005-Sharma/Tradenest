import { ApiError } from '../utils/ApiError.js';

/**
 * Validates a request section against a Zod schema and replaces it with the
 * parsed result, so controllers only ever see coerced, trusted values.
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return next(ApiError.badRequest('Validation failed', details));
  }

  if (source === 'body') req.body = result.data;
  else req.validated = { ...(req.validated || {}), [source]: result.data };

  return next();
};
