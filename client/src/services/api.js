import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const usersApi = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users/', userData),
};

// Courses API
export const coursesApi = {
  getAll: () => api.get('/courses/'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses/', courseData),
};

// Tee Times API
export const teeTimesApi = {
  getAll: () => api.get('/tee-times/'),
  getById: (id) => api.get(`/tee-times/${id}`),
  create: (teeTimeData) => api.post('/tee-times/', teeTimeData),
  assignUser: (teeTimeId, userData) => api.put(`/tee-times/${teeTimeId}/assign`, userData),
};

export default {
  users: usersApi,
  courses: coursesApi,
  teeTimes: teeTimesApi,
};