export interface User {
  id: number;
  first_name: string;
  last_name: string;
  address?: string;
  phone_number?: string;
}

export interface UserWithHobbies extends User {
  hobbies?: string;
}

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  address?: string;
  phone_number?: string;
}

export interface CreateHobbyInput {
  user_id: number;
  hobbies: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
