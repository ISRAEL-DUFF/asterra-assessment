import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils'
import logger from '../utils/logger'

/**
 * Global error handler middleware
 * Should be registered last in the middleware chain
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _: NextFunction
): Response => {
  logger.error('Error caught by error handler', {
    message: err.message,
    stack: err.stack,
    path: req.url,
    statusCode: err.statusCode || 500
  })

  // Handle specific error types
  if (err.code === '23503') {
    // Foreign key constraint violation
    return sendError(res, 'Referenced resource not found', 400)
  }

  if (err.code === '23505') {
    // Unique constraint violation
    return sendError(res, 'Duplicate entry', 409)
  }

  if (err.message.includes('not found')) {
    return sendError(res, err.message, 404)
  }

  const statusCode = err.statusCode || 500
  const message = statusCode === 500 ? 'Internal server error' : err.message

  return sendError(res, message, statusCode)
}

/**
 * 404 handler - catch undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return sendError(res, `Route ${req.method} ${req.path} not found`, 404)
}
