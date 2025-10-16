import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('organizerToken');
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
    if (error.response?.status === 401) {
      localStorage.removeItem('organizerToken');
      localStorage.removeItem('organizer');
      window.location.href = '/organizer/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Events API
export const eventsAPI = {
  getEvents: (params = {}) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  getEventBySlug: (slug) => api.get(`/events/slug/${slug}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// Tickets API
export const ticketsAPI = {
  getTickets: (eventId) => api.get(`/tickets/event/${eventId}`),
  createTicket: (data) => api.post('/tickets', data),
  updateTicket: (id, data) => api.put(`/tickets/${id}`, data),
  deleteTicket: (id) => api.delete(`/tickets/${id}`),
};

// Registrations API
export const registrationsAPI = {
  createRegistration: (data) => api.post('/registrations', data),
  getRegistrations: (eventId) => api.get(`/registrations/event/${eventId}`),
  getRegistration: (id) => api.get(`/registrations/${id}`),
  updateRegistration: (id, data) => api.put(`/registrations/${id}`, data),
};

// Check-ins API
export const checkInsAPI = {
  createCheckIn: (data) => api.post('/check-ins', data),
  getCheckIns: (eventId) => api.get(`/check-ins/event/${eventId}`),
  getCheckInByQR: (qrCode) => api.get(`/check-ins/qr/${qrCode}`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
