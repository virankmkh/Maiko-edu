import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('organizerToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or other global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      console.log('Unauthorized request, redirecting to login...');
      // Optionally clear token and redirect
      // localStorage.removeItem('organizerToken');
      // window.location.href = '/organizer/login';
    }
    return Promise.reject(error);
  }
);

export const fetchEvents = async (params) => {
  const response = await api.get('/events', { params });
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const fetchEventBySlug = async (slug) => {
  const response = await api.get(`/events/slug/${slug}`);
  return response.data;
};

export const registerOrganizer = async (formData) => {
  const response = await api.post('/auth/register', formData);
  return response.data;
};

export const loginOrganizer = async (formData) => {
  const response = await api.post('/auth/login', formData);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await api.post('/organizers/events', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/organizers/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/organizers/events/${eventId}`);
  return response.data;
};

// Add more API calls as needed for tickets, registrations, etc.

export default api;
