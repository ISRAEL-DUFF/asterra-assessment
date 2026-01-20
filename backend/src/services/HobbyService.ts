import { query } from '../config/database'
import config from '../config'
import { Hobby, CreateHobbyRequest } from '../types'
import logger from '../utils/logger'

class HobbyService {
  async createHobby(data: CreateHobbyRequest): Promise<Hobby> {
    try {
      const { user_id, hobbies } = data

      // Verify user exists
      const userCheck = await query(
        `SELECT id FROM ${config.dbSchema}.users WHERE id = $1`,
        [user_id]
      )

      if (userCheck.rows.length === 0) {
        throw new Error(`User with ID ${user_id} not found`)
      }

      const result = await query(
        `INSERT INTO ${config.dbSchema}.hobbies (user_id, hobbies)
         VALUES ($1, $2)
         RETURNING *`,
        [user_id, hobbies]
      )

      const hobby = result.rows[0]
      logger.info(`Hobby added for user: ${user_id} - ${hobbies}`)
      return hobby
    } catch (error) {
      logger.error('Error creating hobby', error)
      throw error
    }
  }

  async deleteHobby(userId: number, hobby: string): Promise<boolean> {
    try {
      const result = await query(
        `DELETE FROM ${config.dbSchema}.hobbies 
         WHERE user_id = $1 AND hobbies = $2`,
        [userId, hobby]
      )

      if (result.rowCount === 0) {
        return false
      }

      logger.info(`Hobby deleted for user ${userId}: ${hobby}`)
      return true
    } catch (error) {
      logger.error('Error deleting hobby', error)
      throw error
    }
  }

  async getUserHobbies(userId: number): Promise<Hobby[]> {
    try {
      const result = await query(
        `SELECT * FROM ${config.dbSchema}.hobbies WHERE user_id = $1 ORDER BY created_at`,
        [userId]
      )
      return result.rows
    } catch (error) {
      logger.error('Error fetching hobbies', error)
      throw error
    }
  }
}

export default new HobbyService()
