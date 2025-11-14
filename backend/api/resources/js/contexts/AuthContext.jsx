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
      console.log("=== AUTH CONTEXT LOGIN ERROR ===");
      console.log("Error:", err);
      console.log("Error.response:", err.response);
      console.log("Error.response.data:", err.response?.data);
      console.log("Error.response.data.errors:", err.response?.data?.errors);
      console.log("================================");
      
      setLoading(false);
      
      // Handle different error formats from backend
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      
      // Check if error has response (Axios error structure)
      if (err.response && err.response.data) {
        const { data } = err.response;
        
        // Check if we have validation errors (Laravel 422 response)
        if (data.errors && typeof data.errors === 'object') {
          // Get the first error message from the errors object
          const firstErrorKey = Object.keys(data.errors)[0];
          const firstErrorMessages = data.errors[firstErrorKey];
          
          // Extract the first message
          if (Array.isArray(firstErrorMessages) && firstErrorMessages.length > 0) {
            errorMessage = firstErrorMessages[0];
          } else if (typeof firstErrorMessages === 'string') {
            errorMessage = firstErrorMessages;
          }
        } else if (data.message) {
          // Use the general message if no specific field errors
          errorMessage = data.message;
        }
      } else if (err.message) {
        // Axios error message
        errorMessage = err.message;
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
      
      const { user, type: responseType } = response.data;
      
      setLoading(false);
      
      // Don't auto-login, just return success
      return { success: true, user, type: responseType };
      
    } catch (err) {
      setLoading(false);
      
      // Handle different error formats
      let errorMessage = 'Terjadi kesalahan saat mendaftar.';
      let errors = {};
      
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors) {
          errors = data.errors;
        }
        if (data.message) {
          errorMessage = data.message;
        }
      } else if (err.errors) {
        errors = err.errors;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw { message: errorMessage, errors };
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
