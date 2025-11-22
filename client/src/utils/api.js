import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// User APIs
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);

// Workout APIs
export const generateWorkout = () => API.post('/workouts/generate');
export const getWorkoutHistory = () => API.get('/workouts/history');
export const getWorkout = (id) => API.get(`/workouts/${id}`);

// Meal APIs
export const generateMeal = () => API.post('/meals/generate');
export const getMealHistory = () => API.get('/meals/history');
export const getMeal = (id) => API.get(`/meals/${id}`);

// Chat APIs
export const chatWithCoach = (data) => API.post('/chat', data);

export default API;
