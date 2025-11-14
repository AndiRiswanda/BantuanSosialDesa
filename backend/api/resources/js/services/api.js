import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Change to false for token-based auth
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("=== AXIOS INTERCEPTOR ERROR ===");
    console.log("Error:", error);
    console.log("Error response:", error.response);
    console.log("Error response data:", error.response?.data);
    console.log("==============================");
    
    if (error.response) {
      // Server responded with error
      const { status } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Keep the original error structure so DonorLoginPage can access error.response.data
      // Don't modify the error, just reject it as-is
      return Promise.reject(error);
    }
    
    // Network error
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  // Admin login
  adminLogin: (credentials) => api.post('/api/admin/login', credentials),
  
  // Donatur login
  donorLogin: (credentials) => api.post('/api/login/donatur', credentials),
  
  // Recipient login
  recipientLogin: (credentials) => api.post('/api/login/recipient', credentials),
  
  // Register donatur
  registerDonor: (data) => api.post('/api/register/donatur', data),
  
  // Register recipient
  registerRecipient: (data) => api.post('/api/register/recipient', data),
  
  // Logout
  logout: () => api.post('/api/logout'),
  
  // Get current user
  getUser: () => api.get('/api/user'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPrograms: (params) => api.get('/admin/programs', { params }),
  createProgram: (data) => api.post('/admin/programs', data),
  updateProgram: (id, data) => api.put(`/admin/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/admin/programs/${id}`),
  
  getDonors: (params) => api.get('/admin/donors', { params }),
  getDonorDetail: (id) => api.get(`/admin/donors/${id}`),
  verifyDonor: (id, data) => api.put(`/admin/verifications/donors/${id}`, data),
  
  getRecipients: (params) => api.get('/admin/recipients', { params }),
  getRecipientDetail: (id) => api.get(`/admin/recipients/${id}`),
  verifyRecipient: (id, data) => api.put(`/admin/verifications/recipients/${id}`, data),
  
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  
  getPenerimaPrograms: (params) => api.get('/admin/penerima-program', { params }),
  assignPenerimaToProgram: (data) => api.post('/admin/penerima-program', data),
  
  getTransaksi: (params) => api.get('/admin/transaksi', { params }),
  createTransaksi: (data) => api.post('/admin/transaksi', data),
};

// Donor APIs
export const donorAPI = {
  getDashboard: () => api.get('/donor/dashboard'),
  getPrograms: (params) => api.get('/donor/programs', { params }),
  getProgramDetail: (id) => api.get(`/donor/programs/${id}`),
  createProgram: (data) => api.post('/donor/programs', data),
  updateProgram: (id, data) => api.put(`/donor/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/donor/programs/${id}`),
  getCategories: () => api.get('/donor/categories'),
  getProfile: () => api.get('/donor/profile'),
  updateProfile: (data) => api.put('/donor/profile', data),
};

// Recipient APIs
export const recipientAPI = {
  getDashboard: () => api.get('/recipient/dashboard'),
  getPrograms: () => api.get('/recipient/programs'),
  getProgramDetail: (id) => api.get(`/recipient/programs/${id}`),
  applyToProgram: (id) => api.post(`/recipient/programs/${id}/apply`),
  getApplications: () => api.get('/recipient/applications'),
  uploadDocument: (data) => api.post('/recipient/documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getProfile: () => api.get('/recipient/profile'),
  updateProfile: (data) => api.put('/recipient/profile', data),
};

// Public APIs
export const publicAPI = {
  getPrograms: (params) => api.get('/programs', { params }),
  getProgramDetail: (id) => api.get(`/programs/${id}`),
};

export default api;
