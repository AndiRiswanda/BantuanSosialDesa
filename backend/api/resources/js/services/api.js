import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
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
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Return error message
      return Promise.reject(data);
    }
    
    // Network error
    return Promise.reject({
      message: 'Network error. Please check your connection.',
    });
  }
);

// Authentication APIs
export const authAPI = {
  // Admin login
  adminLogin: (credentials) => api.post('/admin/login', credentials),
  
  // Donor login
  donorLogin: (credentials) => api.post('/login/donor', credentials),
  
  // Recipient login
  recipientLogin: (credentials) => api.post('/login/recipient', credentials),
  
  // Register donor
  registerDonor: (data) => api.post('/register/donor', data),
  
  // Register recipient
  registerRecipient: (data) => api.post('/register/recipient', data),
  
  // Logout
  logout: () => api.post('/logout'),
  
  // Get current user
  getUser: () => api.get('/user'),
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
