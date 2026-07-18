import { api } from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data.user),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data.user),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data.data.user),
};

export const profileService = {
  get: () => api.get('/profile').then((r) => r.data.data.user),
  update: (payload) => api.put('/profile', payload).then((r) => r.data.data.user),
  changePassword: (payload) => api.put('/profile/password', payload).then((r) => r.data),
};
