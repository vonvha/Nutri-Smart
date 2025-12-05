import axios from 'axios';
import { NutritionProfile, Meal, HistoryDay, FoodItem, Notification, Appointment } from '../models/nutrition';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (response.data.access_token) {
    localStorage.setItem('authToken', response.data.access_token);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  return apiClient.post('/auth/register', { name, email, password });
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// --- Profile ---
export const getProfile = async (): Promise<NutritionProfile> => {
  const response = await apiClient.get('/profile/');
  return response.data;
};

export const saveProfile = async (profileData: NutritionProfile): Promise<NutritionProfile> => {
  const response = await apiClient.post('/profile/', profileData);
  return response.data;
};

// --- Dashboard ---
export const getDashboardData = async () => {
  const response = await apiClient.get('/dashboard/');
  return response.data;
}

// --- Plan ---
export const getPlan = async () => {
  const response = await apiClient.get('/plan/');
  return response.data;
}

// --- History ---
export const getHistory = async () => {
  const response = await apiClient.get('/history/');
  return response.data;
}

// --- Food ---
export const getRecentFoods = async () => {
  const response = await apiClient.get('/food/recent');
  return response.data;
}

// NUEVA FUNCIÓN: Buscar en la base de datos global
export const searchFoodsInDb = async (query: string) => {
  const response = await apiClient.get(`/food/search?q=${encodeURIComponent(query)}`);
  return response.data;
}

export const logFood = async (foodName: string, calories?: number) => {
  const payload: any = { food_name: foodName };
  if (calories) {
    payload.calories = calories;
  }
  const response = await apiClient.post('/food/log', payload);
  return response.data;
}

// --- Vision ---
export const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/vision/analyze-food', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- Notifications ---
export const getNotifications = async () => {
  const response = await apiClient.get('/notifications/');
  return response.data;
}

// --- Appointments ---
export const getNextAppointment = async () => {
  const response = await apiClient.get('/appointments/');
  return response.data;
}

export const scheduleAppointment = async (appointment: { date: string, time: string, type: string }) => {
  const response = await apiClient.post('/appointments/', appointment);
  return response.data;
}