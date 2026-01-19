import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import config from './config'
import { initializeDatabase, closeDatabase } from './config/database'
import apiRoutes from './routes'
import { apiLimiter, errorHandler, notFoundHandler, requestLogger, spaFallback } from './middleware'
import logger from './utils/logger'

const app: Application = express()

/**
 * Security Middleware
 */
// Helmet helps secure Express apps by setting various HTTP headers
// In non-production, disable contentSecurityPolicy and crossOriginOpenerPolicy
// to avoid HTTPS enforcement that breaks HTTP-only deployments
app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === 'production',
  crossOriginOpenerPolicy: config.nodeEnv === 'production',
}))

/**
 * CORS Configuration
 */
const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10kb' })) // Limit payload to 10kb
app.use(express.urlencoded({ limit: '10kb', extended: true }))

/**
 * Logging Middleware
 */
app.use(requestLogger)

/**
 * Static Files (Frontend)
 * Serve the React/frontend build from public folder
 * Routes: /, /index.html, and all client-side routes
 */
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1h',
  etag: false,
}))

/**
 * Rate Limiting Middleware
 */
app.use('/api/', apiLimiter)

/**
 * Routes
 */
app.use('/api', apiRoutes)

/**
 * SPA Fallback (must come before 404 handler)
 * Redirect non-API routes without extensions to index.html for client-side routing
 */
app.use(spaFallback)

/**
 * 404 Handler (must come after all routes)
 */
app.use('*', notFoundHandler)

/**
 * Global Error Handler (must come last)
 */
app.use(errorHandler)

/**
 * Graceful Shutdown
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}, shutting down gracefully...`)
  
  try {
    await closeDatabase()
    process.exit(0)
  } catch (error) {
    logger.error('Error during shutdown', error)
    process.exit(1)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

/**
 * Start Server
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    initializeDatabase()
    logger.info('Database initialized')

    // Start listening
    app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`)
      logger.info(`Environment: ${config.nodeEnv}`)
      logger.info(`CORS enabled for: ${config.cors.origin}`)
      logger.info(`Static files served from: /public`)
      logger.info(`Frontend available at http://localhost:${config.port}`)
      logger.info(`API available at http://localhost:${config.port}/api`)
    })
  } catch (error) {
    logger.error('Failed to start server', error)
    process.exit(1)
  }
}

// Start the server
startServer()

export default app
