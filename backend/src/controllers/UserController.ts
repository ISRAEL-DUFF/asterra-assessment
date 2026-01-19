import { Request, Response } from 'express'
import { UserService } from '../services'
import { sendSuccess, sendError, asyncHandler, validateRequest } from '../utils'
import { createUserSchema } from '../utils/validation'
import { CreateUserRequest } from '../types'

class UserController {
  /**
   * GET /api/users
   * Get all users
   */
  getAllUsers = asyncHandler(async (_: Request, res: Response) => {
    const users = await UserService.getAllUsers()
    sendSuccess(res, users, 200, 'Users retrieved successfully')
  })

  /**
   * GET /api/users/:userId
   * Get user by ID
   */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const user = await UserService.getUserById(parseInt(userId, 10))

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    return sendSuccess(res, user, 200, 'User retrieved successfully')
  })

  /**
   * POST /api/users
   * Create new user
   */
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { valid, errors } = await validateRequest(req.body, createUserSchema)

    if (!valid) {
      return sendError(res, 'Validation failed', 400, { validationErrors: errors })
    }

    const user = await UserService.createUser(req.body as CreateUserRequest)
    return sendSuccess(res, user, 201, 'User created successfully')
  })

  /**
   * DELETE /api/users/:userId
   * Delete user by ID
   */
  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const deleted = await UserService.deleteUser(parseInt(userId, 10))

    if (!deleted) {
      return sendError(res, 'User not found', 404)
    }

    return sendSuccess(res, { id: userId }, 200, 'User deleted successfully')
  })

  /**
   * GET /api/users-hobbies
   * Get all users with their hobbies
   */
  getUsersWithHobbies = asyncHandler(async (_: Request, res: Response) => {
    const data = await UserService.getUsersWithHobbies()
    sendSuccess(res, data, 200, 'Users with hobbies retrieved successfully')
  })
}

export default new UserController()
