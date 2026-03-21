import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getAdminUsers: () => api.get('/auth/admin-users'),
  createAdminUser: (data) => api.post('/auth/admin-users', data),
  updateAdminUser: (id, data) => api.put(`/auth/admin-users/${id}`, data),
  deleteAdminUser: (id) => api.delete(`/auth/admin-users/${id}`),
};

// Guides endpoints
export const guidesAPI = {
  getAll: () => api.get('/guides'),
  getAllAdmin: () => api.get('/guides/admin/all'),
  getByCategory: (category) => api.get(`/guides/category/${category}`),
  getById: (id) => api.get(`/guides/${id}`),
  create: (data) => api.post('/guides', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/guides/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/guides/${id}`),
};

// Blogs endpoints
export const blogsAPI = {
  getAll: (page = 1) => api.get(`/blogs?page=${page}`),
  getAllAdmin: (page = 1) => api.get(`/blogs/admin/all?page=${page}`),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  create: (data) => api.post('/blogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/blogs/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/blogs/${id}`),
};

// Marketplace endpoints
export const marketplaceAPI = {
  getAll: (page = 1) => api.get(`/marketplace?page=${page}`),
  getAllAdmin: (page = 1) => api.get(`/marketplace/admin/all?page=${page}`),
  getByCategory: (category, page = 1) => api.get(`/marketplace/category/${category}?page=${page}`),
  getById: (id) => api.get(`/marketplace/${id}`),
  create: (data) => api.post('/marketplace', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/marketplace/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/marketplace/${id}`),
};

// Payment endpoints
export const paymentsAPI = {
  initiateMpesa: (data) => api.post('/payments/initiate', data),
  getHistory: () => api.get('/payments/history'),
  checkAccess: (guideId) => api.get(`/payments/access/${guideId}`),
};

export default api;
