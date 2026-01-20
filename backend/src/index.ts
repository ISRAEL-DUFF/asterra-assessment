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

app.use(helmet({
  contentSecurityPolicy: config.nodeEnv === 'production',
  crossOriginOpenerPolicy: config.nodeEnv === 'production',
}))

const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions))

app.use(express.json({ limit: '10kb' })) // Limit payload to 10kb
app.use(express.urlencoded({ limit: '10kb', extended: true }))

app.use(requestLogger)
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1h',
  etag: false,
}))

app.use('/api/', apiLimiter)
app.use('/api', apiRoutes)

app.use(spaFallback)

app.use('*', notFoundHandler)

app.use(errorHandler)

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

const startServer = async (): Promise<void> => {
  try {
    initializeDatabase()
    logger.info('Database initialized')

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

startServer()

export default app
