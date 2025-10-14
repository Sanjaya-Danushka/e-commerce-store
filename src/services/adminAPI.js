import axios from 'axios';
import { logger } from '../utils/logger';

// Create axios instance with auth headers
const api = axios.create({
  baseURL: '/api'
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  // Get token from localStorage
  let token = localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    logger.log('Using token for request to:', config.url);
  } else {
    logger.log('No token available for request to:', config.url);
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

const adminAPI = {
  // Admin authentication
  login: (credentials) => api.post('/auth/admin/login', credentials),

  // Product management
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (product) => api.post('/admin/products', product),
  updateProduct: (id, product) => api.put(`/admin/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Image upload
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);

    logger.log('Uploading image with automatic token handling');

    return api.post('/admin/upload', formData);
  },

  // Order management
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/admin/orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  getOrderStats: () => api.get('/admin/orders/stats'),

  // Stats
  getStats: () => api.get('/admin/stats')
};

export default adminAPI;
