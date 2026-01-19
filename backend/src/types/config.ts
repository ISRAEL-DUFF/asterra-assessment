export interface DatabaseConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  ssl: {
    rejectUnauthorized: boolean
  }
}

export interface AppConfig {
  port: number
  nodeEnv: 'development' | 'production' | 'test'
  db: DatabaseConfig
  rateLimiting: {
    windowMs: number
    maxRequests: number
  }
  cors: {
    origin: string | string[]
  }
  dbSchema: string
}
