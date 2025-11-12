import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedUserType = localStorage.getItem('userType');
    
    if (token && savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
    setLoading(false);
  }, []);

  const login = async (credentials, type) => {
    setError(null);
    setLoading(true);
    
    try {
      let response;
      
      switch (type) {
        case 'admin':
          response = await authAPI.adminLogin(credentials);
          break;
        case 'donor':
          response = await authAPI.donorLogin(credentials);
          break;
        case 'recipient':
          response = await authAPI.recipientLogin(credentials);
          break;
        default:
          throw new Error('Invalid user type');
      }
      
      const { user, token, type: responseType } = response.data;
      
      // Save to state
      setUser(user);
      setUserType(responseType);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', responseType);
      
      setLoading(false);
      return { success: true, user, type: responseType };
      
    } catch (err) {
      setLoading(false);
      
      // Handle different error formats from backend
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      
      if (err.message) {
        // Direct error message from backend
        errorMessage = err.message;
      } else if (err.errors) {
        // Validation errors from Laravel (422 status)
        // Convert object of errors to a single string
        const errorMessages = Object.values(err.errors)
          .flat()
          .join(', ');
        errorMessage = errorMessages;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (data, type) => {
    setError(null);
    setLoading(true);
    
    try {
      let response;
      
      switch (type) {
        case 'donor':
          response = await authAPI.registerDonor(data);
          break;
        case 'recipient':
          response = await authAPI.registerRecipient(data);
          break;
        default:
          throw new Error('Invalid user type');
      }
      
      const { user, token, type: responseType } = response.data;
      
      // Save to state
      setUser(user);
      setUserType(responseType);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', responseType);
      
      setLoading(false);
      return { success: true, user, type: responseType };
      
    } catch (err) {
      setLoading(false);
      const errorMessage = err.errors 
        ? Object.values(err.errors).flat().join(', ')
        : err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.errors };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear state
      setUser(null);
      setUserType(null);
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  };

  const value = {
    user,
    userType,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: userType === 'admin',
    isDonor: userType === 'donor',
    isRecipient: userType === 'recipient',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
