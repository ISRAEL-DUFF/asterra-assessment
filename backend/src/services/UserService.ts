import { query } from '../config/database'
import config from '../config'
import { User, CreateUserRequest, UserWithHobbies } from '../types'
import logger from '../utils/logger'

class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const result = await query(
        `SELECT * FROM ${config.dbSchema}.users ORDER BY id`
      )
      return result.rows
    } catch (error) {
      logger.error('Error fetching users', error)
      throw error
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const result = await query(
        `SELECT * FROM ${config.dbSchema}.users WHERE id = $1`,
        [userId]
      )
      return result.rows[0] || null
    } catch (error) {
      logger.error('Error fetching user by ID', error)
      throw error
    }
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    try {
      const { first_name, last_name, address, phone_number } = data

      const result = await query(
        `INSERT INTO ${config.dbSchema}.users (first_name, last_name, address, phone_number)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [first_name, last_name, address || null, phone_number || null]
      )

      const user = result.rows[0]
      logger.info(`User created: ${user.id} - ${user.first_name} ${user.last_name}`)
      return user
    } catch (error) {
      logger.error('Error creating user', error)
      throw error
    }
  }

  /**
   * Delete user by ID (cascades to hobbies)
   */
  async deleteUser(userId: number): Promise<boolean> {
    try {
      const result = await query(
        `DELETE FROM ${config.dbSchema}.users WHERE id = $1`,
        [userId]
      )
      
      if (result.rowCount === 0) {
        return false
      }

      logger.info(`User deleted: ${userId}`)
      return true
    } catch (error) {
      logger.error('Error deleting user', error)
      throw error
    }
  }

  /**
   * Get users with their hobbies
   */
  async getUsersWithHobbies(): Promise<UserWithHobbies[]> {
    try {
      const result = await query(
        `SELECT 
           u.id,
           u.first_name,
           u.last_name,
           u.address,
           u.phone_number,
           h.hobbies
         FROM ${config.dbSchema}.users u
         LEFT JOIN ${config.dbSchema}.hobbies h ON u.id = h.user_id
         ORDER BY u.id, h.hobbies`
      )
      return result.rows
    } catch (error) {
      logger.error('Error fetching users with hobbies', error)
      throw error
    }
  }
}

export default new UserService()
