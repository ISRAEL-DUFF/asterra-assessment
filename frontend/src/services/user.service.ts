import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import type { 
  User, 
  UserWithHobbies, 
  CreateUserInput, 
  CreateHobbyInput,
  ApiResponse 
} from '@/types/user';

/**
 * User Service - handles all user-related API operations
 */
export const userService = {
  /**
   * Fetch all users
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(ENDPOINTS.USERS);
  },

  /**
   * Fetch all users with their hobbies
   */
  async getUsersWithHobbies(): Promise<ApiResponse<UserWithHobbies[]>> {
    return apiClient.get<UserWithHobbies[]>(ENDPOINTS.USERS_HOBBIES);
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserInput): Promise<ApiResponse<User>> {
    return apiClient.post<User, CreateUserInput>(ENDPOINTS.USERS, data);
  },

  /**
   * Delete a user by ID
   */
  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${ENDPOINTS.USERS}/${userId}`);
  },
};

/**
 * Hobby Service - handles all hobby-related API operations
 */
export const hobbyService = {
  /**
   * Add a hobby to a user
   */
  async createHobby(data: CreateHobbyInput): Promise<ApiResponse<void>> {
    return apiClient.post<void, CreateHobbyInput>(ENDPOINTS.HOBBIES, data);
  },

  /**
   * Delete a specific hobby from a user
   */
  async deleteHobby(userId: number, hobby: string): Promise<ApiResponse<void>> {
    const encodedHobby = encodeURIComponent(hobby);
    return apiClient.delete<void>(`${ENDPOINTS.HOBBIES}/${userId}/${encodedHobby}`);
  },
};
