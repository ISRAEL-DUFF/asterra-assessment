/**
 * User entity from database
 */
export interface User {
  id: number
  first_name: string
  last_name: string
  address?: string | null
  phone_number?: string | null
  created_at?: Date
}

/**
 * Create user request payload
 */
export interface CreateUserRequest {
  first_name: string
  last_name: string
  address?: string
  phone_number?: string
}

/**
 * Hobby entity from database
 */
export interface Hobby {
  id: number
  user_id: number
  hobbies: string
  created_at?: Date
}

/**
 * Create hobby request payload
 */
export interface CreateHobbyRequest {
  user_id: number
  hobbies: string
}

/**
 * User with hobbies (joined result)
 */
export interface UserWithHobbies extends User {
  hobbies?: string | null
}
