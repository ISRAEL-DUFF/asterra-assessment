import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

/**
 * Request logging middleware
 * Logs incoming requests and response status
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now()

  // Capture the original res.json to log response
  const originalJson = res.json.bind(res)
  res.json = function(data: any) {
    const duration = Date.now() - startTime

    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    })

    return originalJson(data)
  }

  next()
}
