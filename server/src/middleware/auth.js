import { User } from '../models/User.js';
import { verifyToken } from '../services/token.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

/**
 * Reads the JWT from the HTTP-only cookie (preferred) or an Authorization
 * header, then attaches the live user document to req.user.
 */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.[env.cookieName] || headerToken;

  if (!token) throw ApiError.unauthorized('Authentication required');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Session expired or invalid. Please log in again.');
  }

  // Look the user up every request so deleted accounts lose access immediately.
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('Account no longer exists');

  req.user = user;
  next();
});
