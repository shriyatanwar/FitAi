import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// User
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (data) => api.put('/user/profile', data);
export const addProgress = (data) => api.post('/user/progress', data);
export const getProgress = () => api.get('/user/progress');
export const calculateCalories = () => api.post('/user/calculate-calories');

// Workout
export const generateWorkout = () => api.post('/workout/generate');
export const getWorkouts = () => api.get('/workout');
export const getWorkout = (id) => api.get(`/workout/${id}`);
export const deleteWorkout = (id) => api.delete(`/workout/${id}`);

// Meal
export const generateMealPlan = () => api.post('/meal/generate');
export const getMealPlans = () => api.get('/meal');
export const getMealPlan = (id) => api.get(`/meal/${id}`);
export const deleteMealPlan = (id) => api.delete(`/meal/${id}`);

// Chat
export const sendChatMessage = (data) => api.post('/chat', data);

export default api;
