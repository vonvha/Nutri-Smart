// This file contains TypeScript interfaces that correspond to the Pydantic models in the backend.

export interface NutritionProfile {
  goal: string;
  weight: number | string; // string to allow empty input field
  height: number | string;
  age: number | string;
  sex: string;
  activityLevel: string;
  allergies: string[];
}

export interface Meal {
  type: string;
  name: string;
  kcal: number;
  macros: string;
}

export interface HistoryDay {
  date: string;
  calories: number;
  target: number;
  status: 'inprogress' | 'success' | 'warning';
}

export interface FoodItem {
  id: number;
  name: string;
  detail: string;
}

export interface FoodAnalysis {
  is_food: boolean;
  calories?: number;
  protein?: number;
  fat?: number;
  message?: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  time: string;
  description: string;
  isRead: boolean;
}

export interface Appointment {
  date: string;
  time: string;
  type: string;
}

