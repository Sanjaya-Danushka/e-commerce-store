import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

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

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      }

      if (urlToken && urlToken !== storedToken) {
        console.log('Processing OAuth callback token:', urlToken.substring(0, 20) + '...');
        localStorage.setItem('authToken', urlToken);
        setToken(urlToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${urlToken}`;
        window.history.replaceState({}, document.title, window.location.pathname);

        try {
          console.log('Fetching user profile with OAuth token...');
          const axiosInstance = (await import('axios')).default.create({
            baseURL: 'http://localhost:3000',
            headers: {
              'Authorization': `Bearer ${urlToken}`,
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
        console.log('Checking existing token:', storedToken.substring(0, 20) + '...');
        try {
          // Ensure axios has the correct authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axios.get('/api/auth/profile');
          console.log('Token verification successful for user:', response.data.user.email);
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          console.error('Token verification failed:', error.response?.data || error.message);
          localStorage.removeItem('authToken');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;

      console.log('Login successful, setting user:', userData.email);
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('authToken', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Ensure user profile exists in backend
      try {
        await axios.put('/api/auth/profile', {
          profileCompleted: userData.profileCompleted || false
        });
        console.log('User profile synchronized with backend');
      } catch (profileError) {
        console.error('Failed to sync profile:', profileError);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

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

  const register = async (email, password, firstName, lastName) => {
    try {
      console.log('Attempting registration for:', email);
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        firstName,
        lastName
      });
      const { token: newToken, user: userData } = response.data;

      console.log('Registration successful, setting user:', userData.email);
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('authToken', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      // Immediately save basic user data to backend
      try {
        await axios.put('/api/auth/profile', {
          profileCompleted: false
        });
        console.log('Basic user profile created in backend');
      } catch (profileError) {
        console.error('Failed to create basic profile:', profileError);
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout for:', user?.email);
      await axios.post('/api/auth/logout');
      console.log('Logout successful, clearing user and token');
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const getProfile = async () => {
    try {
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

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      };
    }
  };

  const needsProfileCompletion = () => {
    return user && !user.profileCompleted;
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
    updateProfile,
    needsProfileCompletion,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
