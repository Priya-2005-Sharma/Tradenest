import axios from 'axios';

export const api = axios.create({
  // Relative base: Vite proxies /api to the server in dev, and in production
  // the API is served from the same origin (or via a rewrite).
  baseURL:  import.meta.env.VITE_API_URL,
  // Required for the HTTP-only auth cookie to travel with each request.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/** Normalises axios failures into a single Error shape the UI can rely on. */
export const toAppError = (error) => {
  if (error.response) {
    const { message, details } = error.response.data || {};
    const appError = new Error(message || 'Request failed');
    appError.status = error.response.status;
    appError.details = details || [];
    return appError;
  }
  if (error.request) {
    const appError = new Error('Cannot reach the server. Check your connection and try again.');
    appError.status = 0;
    return appError;
  }
  return error;
};

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toAppError(error)),
);
