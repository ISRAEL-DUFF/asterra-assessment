import { Request, Response } from 'express'
import { ApiResponse, ApiError } from '../types'

/**
 * Send successful response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message = 'Success'
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    statusCode,
    message,
    timestamp: new Date().toISOString()
  }
  return res.status(statusCode).json(response)
}

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  error: string,
  statusCode = 500,
  details?: Record<string, any>
): Response => {
  const response: ApiError = {
    success: false,
    error,
    statusCode,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  }
  return res.status(statusCode).json(response)
}

/**
 * Async route handler wrapper to catch errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: (error: any) => void) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * Validate request data against schema
 */
export const validateRequest = async (data: any, schema: any): Promise<{ valid: boolean; errors?: any }> => {
  try {
    await schema.validateAsync(data, { abortEarly: false })
    return { valid: true }
  } catch (error: any) {
    return {
      valid: false,
      errors: error.details?.map((detail: any) => ({
        field: detail.context.key,
        message: detail.message
      }))
    }
  }
}
