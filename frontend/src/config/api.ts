export const API_URL = import.meta.env.VITE_API_URL || 'http://3.75.198.63:3001/api';

export const ENDPOINTS = {
  USERS: '/users',
  USERS_HOBBIES: '/users/with-hobbies/all',
  HOBBIES: '/hobbies',
} as const;
