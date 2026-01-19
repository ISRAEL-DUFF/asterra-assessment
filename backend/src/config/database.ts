import { Pool, PoolClient } from 'pg'
import config from './index'
import { logger } from '../utils'

let pool: Pool | null = null

/**
 * Initialize database connection pool
 */
export const initializeDatabase = (): Pool => {
  if (pool) {
    return pool
  }

  pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    ssl: config.db.ssl,
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  })

  pool.on('error', (err: Error) => {
    logger.error('Unexpected error on idle client', err)
  })

  logger.info('Database connection pool initialized')
  return pool
}

/**
 * Get a client from the pool
 */
export const getClient = async (): Promise<PoolClient> => {
  if (!pool) {
    throw new Error('Database pool not initialized')
  }

  try {
    return await pool.connect()
  } catch (error) {
    logger.error('Failed to get database client', error)
    throw error
  }
}

/**
 * Query helper
 */
export const query = async (text: string, params?: any[]): Promise<any> => {
  const client = await getClient()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

/**
 * Close database pool
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end()
    pool = null
    logger.info('Database connection pool closed')
  }
}

export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database pool not initialized')
  }
  return pool
}
