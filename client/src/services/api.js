import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('campusflow_token');
        localStorage.removeItem('campusflow_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  getUsers: (params) => api.get('/auth/users', { params })
};

// Tickets Endpoints
export const ticketApi = {
  create: (data) => api.post('/tickets', data),
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  update: (id, data) => api.patch(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  addComment: (id, data) => api.post(`/tickets/${id}/comments`, data),
  getComments: (id) => api.get(`/tickets/${id}/comments`),
  getHistory: (id) => api.get(`/tickets/${id}/history`)
};

// Incidents Endpoints
export const incidentApi = {
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  mergeTickets: (id, ticketIds) => api.post(`/incidents/${id}/merge`, { ticketIds }),
  update: (id, data) => api.patch(`/incidents/${id}`, data)
};

// AI Endpoints
export const aiApi = {
  analyze: (data) => api.post('/ai/analyze', data),
  detectDuplicate: (data) => api.post('/ai/detect-duplicate', data),
  checkPriority: (data) => api.post('/ai/priority', data),
  checkAssignment: (data) => api.post('/ai/assignment', data),
  generateReport: () => api.post('/ai/generate-report'),
  getInsights: () => api.get('/ai/insights')
};

// Automation Endpoints
export const automationApi = {
  getRules: () => api.get('/automation/rules'),
  createRule: (data) => api.post('/automation/rules', data),
  updateRule: (id, data) => api.patch(`/automation/rules/${id}`, data),
  runCycle: () => api.post('/automation/run'),
  getLogs: (params) => api.get('/automation/logs', { params })
};

// Analytics Endpoints
export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getCategories: () => api.get('/analytics/categories'),
  getDepartments: () => api.get('/analytics/departments'),
  getPriorities: () => api.get('/analytics/priorities'),
  getSla: () => api.get('/analytics/sla'),
  getRecurring: () => api.get('/analytics/recurring'),
  getTrends: () => api.get('/analytics/trends')
};

// Notifications Endpoints
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all')
};

export default api;
