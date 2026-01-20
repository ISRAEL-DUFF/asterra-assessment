import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import type { 
  User, 
  UserWithHobbies, 
  CreateUserInput, 
  CreateHobbyInput,
  ApiResponse 
} from '@/types/user';

export const userService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(ENDPOINTS.USERS);
  },

  async getUsersWithHobbies(): Promise<ApiResponse<UserWithHobbies[]>> {
    return apiClient.get<UserWithHobbies[]>(ENDPOINTS.USERS_HOBBIES);
  },

  async createUser(data: CreateUserInput): Promise<ApiResponse<User>> {
    return apiClient.post<User, CreateUserInput>(ENDPOINTS.USERS, data);
  },

  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${ENDPOINTS.USERS}/${userId}`);
  },
};

export const hobbyService = {
  async createHobby(data: CreateHobbyInput): Promise<ApiResponse<void>> {
    return apiClient.post<void, CreateHobbyInput>(ENDPOINTS.HOBBIES, data);
  },

  async deleteHobby(userId: number, hobby: string): Promise<ApiResponse<void>> {
    const encodedHobby = encodeURIComponent(hobby);
    return apiClient.delete<void>(`${ENDPOINTS.HOBBIES}/${userId}/${encodedHobby}`);
  },
};
