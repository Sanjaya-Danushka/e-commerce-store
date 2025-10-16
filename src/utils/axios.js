import axios from 'axios';

// Configure axios base URL for API calls
axios.defaults.baseURL = 'http://localhost:3000';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, clear it
      localStorage.removeItem('authToken');
      // Optionally redirect to login or show a message
      console.warn('Authentication token expired or invalid');
    }
    return Promise.reject(error);
  }
);

export default axios;
