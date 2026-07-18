import jwt from 'jsonwebtoken';
import { env, isProduction } from '../config/env.js';

export const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * The token lives in an HTTP-only cookie so page scripts can never read it,
 * which keeps XSS from turning into account takeover.
 */
export const setAuthCookie = (res, token) => {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: SEVEN_DAYS_MS,
    path: '/',
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};
