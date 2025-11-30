// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Set auth token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Get user data from localStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user data to localStorage
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user data from localStorage
export const removeUser = () => {
  localStorage.removeItem('user');
};

// Base fetch function with auth
export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    console.log("=== API FETCH DEBUG ===");
    console.log("Endpoint:", endpoint);
    console.log("Options:", options);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    console.log("Response headers:", response.headers.get('content-type'));
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error("Response is not JSON. Content-Type:", contentType);
      throw new Error('Server response is not JSON');
    }
    
    // Parse JSON
    let data;
    try {
      data = await response.json();
      console.log("Response data:", data);
      console.log("Data type:", typeof data);
      console.log("Data keys:", Object.keys(data));
      console.log("Has errors?", data.errors);
      console.log("Errors type:", typeof data.errors);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error('Failed to parse server response');
    }
    
    if (!response.ok) {
      console.log("Response NOT OK - Creating error object");
      // Create error object that mimics axios error structure
      const error = new Error(data.message || 'Something went wrong');
      error.response = {
        status: response.status,
        data: data, // This should contain {message, errors} from Laravel
        statusText: response.statusText
      };
      console.log("Error object created:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response.data);
      console.log("======================");
      throw error;
    }

    console.log("Response OK - Returning data");
    console.log("======================");
    return data;
  } catch (error) {
    console.log("=== CATCH BLOCK ===");
    console.log("Error:", error);
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    console.log("Has error.response?", !!error.response);
    
    // If it's already our custom error, throw it
    if (error.response) {
      console.log("Throwing custom error with response");
      throw error;
    }
    
    // Check if it's a network error (fetch failed)
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      console.log("Creating network error");
      const networkError = new Error('Network error. Please check your connection.');
      networkError.request = true;
      throw networkError;
    }
    
    // Otherwise, throw the original error
    console.log("Throwing original error");
    error.request = true;
    throw error;
  }
};

// Create axios-like API instance for easier use
const api = {
  get: (url, config = {}) => apiFetch(url, { method: 'GET', ...config }),
  post: (url, data, config = {}) => apiFetch(url, { 
    method: 'POST', 
    body: JSON.stringify(data),
    ...config 
  }),
  put: (url, data, config = {}) => apiFetch(url, { 
    method: 'PUT', 
    body: JSON.stringify(data),
    ...config 
  }),
  delete: (url, config = {}) => apiFetch(url, { method: 'DELETE', ...config }),
};

export default api;

// Auth APIs
export const authAPI = {
  // Generic login - determines endpoint based on role
  login: (credentials) => {
    const role = credentials.role;
    let endpoint = '/api/login';
    
    if (role === 'penerima' || role === 'recipient') {
      endpoint = '/api/login/recipient';
    } else if (role === 'donatur' || role === 'donor') {
      endpoint = '/api/login/donatur';
    } else if (role === 'admin') {
      endpoint = '/api/admin/login';
    }
    
    return apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // Specific login methods
  loginRecipient: (credentials) =>
    apiFetch('/api/login/recipient', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  loginDonor: (credentials) =>
    apiFetch('/api/login/donatur', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  registerDonor: (data) =>
    apiFetch('/api/register/donatur', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  registerRecipient: (data) =>
    apiFetch('/api/register/recipient', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  adminLogin: (credentials) =>
    apiFetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  logout: () =>
    apiFetch('/api/logout', {
      method: 'POST',
    }),
  
  getUser: () => apiFetch('/api/user'),
};

// Donor APIs
export const donorAPI = {
  getDashboard: () => apiFetch('/api/donatur/dashboard'),
  
  getPrograms: () => apiFetch('/api/donatur/programs'),
  
  getProgramDetail: (id) => apiFetch(`/api/donatur/programs/${id}`),
  
  createDonation: (data) =>
    apiFetch('/api/donatur/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getDonations: () => apiFetch('/api/donatur/programs'),
  
  getProfile: () => apiFetch('/api/donatur/profile'),
  
  updateProfile: (data) =>
    apiFetch('/api/donatur/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Upload bukti transfer for pending program
  uploadProof: async (programId, file) => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('bukti_transfer', file);
    
    const response = await fetch(`${API_BASE_URL}/api/donatur/programs/${programId}/upload-proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server response is not JSON');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || 'Failed to upload proof');
      error.response = {
        status: response.status,
        data: data,
        statusText: response.statusText
      };
      throw error;
    }
    
    return data;
  },
};

// Recipient APIs
export const recipientAPI = {
  getDashboard: () => apiFetch('/api/recipient/dashboard'),
  
  getPrograms: () => apiFetch('/api/recipient/programs'),
  
  getProgramDetail: (id) => apiFetch(`/api/recipient/programs/${id}`),
  
  createApplication: (data) =>
    apiFetch('/api/recipient/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getApplications: () => apiFetch('/api/recipient/applications'),
  
  getProfile: () => apiFetch('/api/recipient/profile'),
  
  updateProfile: (data) =>
    apiFetch('/api/recipient/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => apiFetch('/api/admin/dashboard'),
  
  // Programs
  getPrograms: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/programs${queryString ? '?' + queryString : ''}`);
  },
  getPendingPrograms: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/programs/pending/list${queryString ? '?' + queryString : ''}`);
  },
  approveProgram: (id) =>
    apiFetch(`/api/admin/programs/${id}/approve`, {
      method: 'POST',
    }),
  rejectProgram: (id, data) =>
    apiFetch(`/api/admin/programs/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getProgramDetail: (id) => apiFetch(`/api/admin/programs/${id}`),
  createProgram: (data) =>
    apiFetch('/api/admin/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProgram: (id, data) =>
    apiFetch(`/api/admin/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProgram: (id) =>
    apiFetch(`/api/admin/programs/${id}`, {
      method: 'DELETE',
    }),
  
  // Categories
  getCategories: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/categories${queryString ? '?' + queryString : ''}`);
  },
  createCategory: (data) =>
    apiFetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    apiFetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    apiFetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    }),
  
  // Verifications
  getVerifications: () => apiFetch('/api/admin/verifications'),
  getPendingDonors: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/verifications/donatur${queryString ? '?' + queryString : ''}`);
  },
  getPendingRecipients: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/verifications/recipients${queryString ? '?' + queryString : ''}`);
  },
  verifyDonor: (id, data) =>
    apiFetch(`/api/admin/verifications/donatur/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  verifyRecipient: (id, data) =>
    apiFetch(`/api/admin/verifications/recipients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Donors
  getDonors: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/donatur${queryString ? '?' + queryString : ''}`);
  },
  getDonorDetail: (id) => apiFetch(`/api/admin/donatur/${id}`),
  updateDonor: (id, data) =>
    apiFetch(`/api/admin/donatur/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteDonor: (id) =>
    apiFetch(`/api/admin/donatur/${id}`, {
      method: 'DELETE',
    }),
  
  // Recipients
  getRecipients: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/recipients${queryString ? '?' + queryString : ''}`);
  },
  getRecipientDetail: (id) => apiFetch(`/api/admin/recipients/${id}`),
  updateRecipient: (id, data) =>
    apiFetch(`/api/admin/recipients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRecipient: (id) =>
    apiFetch(`/api/admin/recipients/${id}`, {
      method: 'DELETE',
    }),
  
  // Penerima Program (Recipients in Programs)
  getPenerimaPrograms: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/penerima-program${queryString ? '?' + queryString : ''}`);
  },
  assignPenerimaToProgram: (data) =>
    apiFetch('/api/admin/penerima-program', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePenerimaProgram: (id, data) =>
    apiFetch(`/api/admin/penerima-program/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePenerimaProgram: (id) =>
    apiFetch(`/api/admin/penerima-program/${id}`, {
      method: 'DELETE',
    }),
  
  // Transaksi Penyaluran (Distribution Transactions)
  getTransaksi: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/transaksi${queryString ? '?' + queryString : ''}`);
  },
  getTransaksiDetail: (id) => apiFetch(`/api/admin/transaksi/${id}`),
  createTransaksi: (data) =>
    apiFetch('/api/admin/transaksi', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTransaksi: (id, data) =>
    apiFetch(`/api/admin/transaksi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTransaksi: (id) =>
    apiFetch(`/api/admin/transaksi/${id}`, {
      method: 'DELETE',
    }),
  
  // Laporan Transparansi (Transparency Reports)
  getReports: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/reports${queryString ? '?' + queryString : ''}`);
  },
  createReport: (data) =>
    apiFetch('/api/admin/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateReport: (id, data) =>
    apiFetch(`/api/admin/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteReport: (id) =>
    apiFetch(`/api/admin/reports/${id}`, {
      method: 'DELETE',
    }),
  
  // Analytics
  getAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/analytics${queryString ? '?' + queryString : ''}`);
  },
  
  // Profile
  getProfile: () => apiFetch('/api/admin/profile'),
  updateProfile: (data) =>
    apiFetch('/api/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (data) =>
    apiFetch('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Public APIs
export const publicAPI = {
  getPrograms: () => apiFetch('/api/programs'),
  getProgramDetail: (id) => apiFetch(`/api/programs/${id}`),
  submitPengaduan: (data) =>
    apiFetch('/api/pengaduan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
