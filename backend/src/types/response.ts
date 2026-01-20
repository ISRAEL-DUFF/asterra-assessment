
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode: number
  timestamp: string
}

export interface ApiError {
  success: false
  error: string
  statusCode: number
  timestamp: string
  details?: Record<string, any>
}
export interface DatabaseError extends Error {
  code?: string
  detail?: string
}

export interface ValidationError {
  field: string
  message: string
}
