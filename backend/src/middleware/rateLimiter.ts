import rateLimit from 'express-rate-limit'
import config from '../config'
import logger from '../utils/logger'

/**
 * General API rate limiter
 * Applies to all /api/* routes
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimiting.windowMs,
  max: config.rateLimiting.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks or certain paths
    return req.path === '/health'
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path })
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      statusCode: 429,
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * Strict rate limiter for authentication endpoints
 * Applies to sensitive operations
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Strict rate limit exceeded', { ip: req.ip, path: req.path })
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      statusCode: 429,
      timestamp: new Date().toISOString()
    })
  }
})
