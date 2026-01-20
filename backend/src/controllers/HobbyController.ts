import { Request, Response } from 'express'
import { HobbyService } from '../services'
import { sendSuccess, sendError, asyncHandler, validateRequest } from '../utils'
import { createHobbySchema } from '../utils/validation'
import { CreateHobbyRequest } from '../types'

class HobbyController {
  createHobby = asyncHandler(async (req: Request, res: Response) => {
    const { valid, errors } = await validateRequest(req.body, createHobbySchema)

    if (!valid) {
      return sendError(res, 'Validation failed', 400, { validationErrors: errors })
    }

    const hobby = await HobbyService.createHobby(req.body as CreateHobbyRequest)
    return sendSuccess(res, hobby, 201, 'Hobby created successfully')
  })

  deleteHobby = asyncHandler(async (req: Request, res: Response) => {
    const { userId, hobby } = req.params
    const decodedHobby = decodeURIComponent(hobby)

    const deleted = await HobbyService.deleteHobby(parseInt(userId, 10), decodedHobby)

    if (!deleted) {
      return sendError(res, 'Hobby not found', 404)
    }

    return sendSuccess(res, { userId, hobby: decodedHobby }, 200, 'Hobby deleted successfully')
  })

  getUserHobbies = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const hobbies = await HobbyService.getUserHobbies(parseInt(userId, 10))
    return sendSuccess(res, hobbies, 200, 'Hobbies retrieved successfully')
  })
}

export default new HobbyController()
