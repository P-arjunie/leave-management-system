import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { apiCall } from '../../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await apiCall('get', '/user');
          setUser(response.data);
        } catch (error) {
          console.error('Fetch user error:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (userData) => {
    try {
      const response = await apiCall('post', '/login', userData);
      const data = response.data;
  
      if (!data.access_token || !data.user) {
        console.error('Invalid login response:', data);
        return { success: false, error: 'Invalid response from server' };
      }
  
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
  
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // If validation errors were thrown
      if (error.response?.data?.errors) {
        return {
          success: false,
          error: 'Validation error',
          fieldErrors: error.response.data.errors,
        };
      }
  
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await apiCall('post', '/register', userData);
      const data = response.data;

      if (data.access_token) {
        setToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('token', data.access_token);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        return { success: false, error: Array.isArray(firstError) ? firstError[0] : firstError };
      }
      return { success: false, error: error.response?.data?.message || error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (token) {
        await apiCall('post', '/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user && !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};