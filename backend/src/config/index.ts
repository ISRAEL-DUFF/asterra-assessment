import dotenv from 'dotenv'
import { AppConfig } from '../types'

dotenv.config()

console.log({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'test_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: {
        rejectUnauthorized: false
      }
    })

const getConfig = (): AppConfig => {
  const config: AppConfig = {
    port: parseInt(process.env.SERVER_PORT || '3002', 10), 
    nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'test_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: {
        rejectUnauthorized: false
      }
    },
    rateLimiting: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
    },
    cors: {
      origin: [process.env.CORS_ORIGIN || 'http://3.75.198.63:3001', 'http://localhost:8080', 'http://3.75.198.63:3001']
    },
    dbSchema: process.env.DB_SCHEMA || 'test_scheme'
  }

  validateConfig(config)
  return config
}

const validateConfig = (config: AppConfig): void => {
  const requiredFields = [
    'db.host',
    'db.port',
    'db.database',
    'db.user',
    'db.password'
  ]

  const missingFields = requiredFields.filter(field => {
    const [section, key] = field.split('.')
    const value = config[section as keyof AppConfig]
    if (typeof value === 'object' && value !== null) {
      return !value[key as keyof typeof value]
    }
    return !value
  })

  if (missingFields.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingFields.join(', ')}`)
  }
}

export default getConfig()
