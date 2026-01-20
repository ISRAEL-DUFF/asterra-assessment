import { Request, Response } from 'express'
import { UserService } from '../services'
import { sendSuccess, sendError, asyncHandler, validateRequest } from '../utils'
import { createUserSchema } from '../utils/validation'
import { CreateUserRequest } from '../types'

class UserController {
  getAllUsers = asyncHandler(async (_: Request, res: Response) => {
    const users = await UserService.getAllUsers()
    sendSuccess(res, users, 200, 'Users retrieved successfully')
  })

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const user = await UserService.getUserById(parseInt(userId, 10))

    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    return sendSuccess(res, user, 200, 'User retrieved successfully')
  })

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { valid, errors } = await validateRequest(req.body, createUserSchema)

    if (!valid) {
      return sendError(res, 'Validation failed', 400, { validationErrors: errors })
    }

    const user = await UserService.createUser(req.body as CreateUserRequest)
    return sendSuccess(res, user, 201, 'User created successfully')
  })

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const deleted = await UserService.deleteUser(parseInt(userId, 10))

    if (!deleted) {
      return sendError(res, 'User not found', 404)
    }

    return sendSuccess(res, { id: userId }, 200, 'User deleted successfully')
  })

  getUsersWithHobbies = asyncHandler(async (_: Request, res: Response) => {
    const data = await UserService.getUsersWithHobbies()
    sendSuccess(res, data, 200, 'Users with hobbies retrieved successfully')
  })
}

export default new UserController()
