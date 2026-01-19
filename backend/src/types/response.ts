/**
 * API Response type for consistent response format
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  statusCode: number
  timestamp: string
}

/**
 * Error response type
 */
export interface ApiError {
  success: false
  error: string
  statusCode: number
  timestamp: string
  details?: Record<string, any>
}

/**
 * Database error type
 */
export interface DatabaseError extends Error {
  code?: string
  detail?: string
}

/**
 * Request validation error
 */
export interface ValidationError {
  field: string
  message: string
}
