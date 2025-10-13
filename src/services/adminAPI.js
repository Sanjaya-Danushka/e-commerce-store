import axios from 'axios';

// Create axios instance with auth headers
const api = axios.create({
  baseURL: '/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

    // Get the current token
    const token = localStorage.getItem('adminToken');

    console.log('Uploading image with token:', token ? 'Present' : 'Missing');

    return api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
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
