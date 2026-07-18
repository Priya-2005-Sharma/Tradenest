import { api } from './api.js';

export const holdingService = {
  list: () => api.get('/holdings').then((r) => r.data.data),
  create: (payload) => api.post('/holdings', payload).then((r) => r.data.data.holding),
  update: (id, payload) => api.put(`/holdings/${id}`, payload).then((r) => r.data.data.holding),
  remove: (id) => api.delete(`/holdings/${id}`).then((r) => r.data),
};

export const watchlistService = {
  list: () => api.get('/watchlist').then((r) => r.data.data.watchlist),
  add: (payload) => api.post('/watchlist', payload).then((r) => r.data.data.item),
  update: (id, payload) => api.put(`/watchlist/${id}`, payload).then((r) => r.data.data.item),
  remove: (id) => api.delete(`/watchlist/${id}`).then((r) => r.data),
};

export const orderService = {
  list: (params) => api.get('/orders', { params }).then((r) => r.data.data.orders),
  get: (id) => api.get(`/orders/${id}`).then((r) => r.data.data.order),
  create: (payload) => api.post('/orders', payload).then((r) => r.data.data.order),
  update: (id, payload) => api.put(`/orders/${id}`, payload).then((r) => r.data.data.order),
  cancel: (id) => api.delete(`/orders/${id}`).then((r) => r.data),
};

export const positionService = {
  list: () => api.get('/positions').then((r) => r.data.data),
  create: (payload) => api.post('/positions', payload).then((r) => r.data.data.position),
  update: (id, payload) => api.put(`/positions/${id}`, payload).then((r) => r.data.data.position),
  remove: (id) => api.delete(`/positions/${id}`).then((r) => r.data),
};

export const fundService = {
  get: () => api.get('/funds').then((r) => r.data.data.funds),
  deposit: (payload) => api.post('/funds/deposit', payload).then((r) => r.data.data.funds),
  withdraw: (payload) => api.post('/funds/withdraw', payload).then((r) => r.data.data.funds),
};

export const marketService = {
  instruments: (params) => api.get('/market/instruments', { params }).then((r) => r.data.data.instruments),
  quote: (symbol) => api.get(`/market/quote/${symbol}`).then((r) => r.data.data.quote),
  overview: () => api.get('/market/overview').then((r) => r.data.data),
  movers: () => api.get('/market/movers').then((r) => r.data.data),
  news: () => api.get('/market/news').then((r) => r.data.data.news),
};

export const dashboardService = {
  get: () => api.get('/dashboard').then((r) => r.data.data),
  portfolio: () => api.get('/dashboard/portfolio').then((r) => r.data.data),
};

export const notificationService = {
  list: () => api.get('/notifications').then((r) => r.data.data),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.put('/notifications/read-all').then((r) => r.data),
  remove: (id) => api.delete(`/notifications/${id}`).then((r) => r.data),
};
