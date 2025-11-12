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
const apiFetch = async (endpoint, options = {}) => {
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// Auth APIs
export const authAPI = {
  login: (credentials) => 
    apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  registerDonor: (data) =>
    apiFetch('/api/register/donor', {
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
  getDashboard: () => apiFetch('/api/donor/dashboard'),
  
  getPrograms: () => apiFetch('/api/donor/programs'),
  
  getProgramDetail: (id) => apiFetch(`/api/donor/programs/${id}`),
  
  createDonation: (data) =>
    apiFetch('/api/donor/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getDonations: () => apiFetch('/api/donor/donations'),
  
  getProfile: () => apiFetch('/api/donor/profile'),
  
  updateProfile: (data) =>
    apiFetch('/api/donor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
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
  getPrograms: () => apiFetch('/api/admin/programs'),
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
  
  // Donations
  getDonations: () => apiFetch('/api/admin/donations'),
  getDonationDetail: (id) => apiFetch(`/api/admin/donations/${id}`),
  updateDonation: (id, data) =>
    apiFetch(`/api/admin/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  scheduleDonation: (id, data) =>
    apiFetch(`/api/admin/donations/${id}/schedule`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Distributions
  getDistributions: () => apiFetch('/api/admin/distributions'),
  verifyDistribution: (data) =>
    apiFetch('/api/admin/distributions/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Verifications
  getVerifications: () => apiFetch('/api/admin/verifications'),
  verifyDonor: (id, data) =>
    apiFetch(`/api/admin/verifications/donors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  verifyRecipient: (id, data) =>
    apiFetch(`/api/admin/verifications/recipients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Donors
  getDonors: () => apiFetch('/api/admin/donors'),
  getDonorDetail: (id) => apiFetch(`/api/admin/donors/${id}`),
  updateDonor: (id, data) =>
    apiFetch(`/api/admin/donors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Recipients
  getRecipients: () => apiFetch('/api/admin/recipients'),
  getRecipientDetail: (id) => apiFetch(`/api/admin/recipients/${id}`),
  updateRecipient: (id, data) =>
    apiFetch(`/api/admin/recipients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Profile
  getProfile: () => apiFetch('/api/admin/profile'),
  updateProfile: (data) =>
    apiFetch('/api/admin/profile', {
      method: 'PUT',
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
