export interface User {
  id: number
  first_name: string
  last_name: string
  address?: string | null
  phone_number?: string | null
  created_at?: Date
}
export interface CreateUserRequest {
  first_name: string
  last_name: string
  address?: string
  phone_number?: string
}
export interface Hobby {
  id: number
  user_id: number
  hobbies: string
  created_at?: Date
}

export interface CreateHobbyRequest {
  user_id: number
  hobbies: string
}

export interface UserWithHobbies extends User {
  hobbies?: string | null
}
