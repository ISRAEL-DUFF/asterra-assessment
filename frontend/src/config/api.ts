// API Configuration
// Can be overridden via VITE_API_URL environment variable
export const API_URL = import.meta.env.VITE_API_URL || 'http://3.75.198.63:3001/api';

// API endpoints
export const ENDPOINTS = {
  USERS: '/users',
  USERS_HOBBIES: '/users/with-hobbies/all',
  HOBBIES: '/hobbies',
} as const;
