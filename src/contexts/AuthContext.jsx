import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');

      // Check for token in URL (OAuth callback)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const error = urlParams.get('error');

      if (error) {
        // Handle OAuth error
        console.error('OAuth error:', error);
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      }

      if (urlToken && urlToken !== storedToken) {
        // New token from OAuth callback
        console.log('Processing OAuth callback token:', urlToken.substring(0, 20) + '...');

        localStorage.setItem('authToken', urlToken);
        setToken(urlToken);

        // Set axios header immediately
        axios.defaults.headers.common['Authorization'] = `Bearer ${urlToken}`;

        // Clean URL first
        window.history.replaceState({}, document.title, window.location.pathname);

        // Fetch user profile with new token
        try {
          console.log('Fetching user profile with OAuth token...');
          const tokenToUse = urlToken;
          console.log('Token to use:', tokenToUse.substring(0, 50) + '...');

          // Create a fresh axios instance for this request to avoid any header conflicts
          const axiosInstance = (await import('axios')).default.create({
            baseURL: 'http://localhost:3000',
            headers: {
              'Authorization': `Bearer ${tokenToUse}`,
              'Content-Type': 'application/json'
            }
          });

          const response = await axiosInstance.get('/api/auth/profile');
          console.log('OAuth user profile fetched successfully:', response.data.user);
          setUser(response.data.user);
        } catch (error) {
          console.error('OAuth token verification failed:', error.response?.data || error.message);
          localStorage.removeItem('authToken');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      } else if (storedToken) {
        try {
          // Verify stored token and get user profile
          const response = await axios.get('/api/auth/profile');
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('authToken', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  // Google login function
  const loginWithGoogle = async (googleData) => {
    try {
      const response = await axios.post('/api/auth/google', googleData);
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('authToken', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed'
      };
    }
  };

  // Register function
  const register = async (email, password, firstName, lastName) => {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName
      });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('authToken', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      // Ensure axios has the proper authorization header
      const currentToken = localStorage.getItem('authToken');
      if (currentToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      }

      const response = await axios.get('/api/auth/profile');
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    getProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
