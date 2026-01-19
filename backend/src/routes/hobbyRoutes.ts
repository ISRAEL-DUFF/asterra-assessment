import { Router } from 'express'
import { HobbyController } from '../controllers'

const router = Router()

/**
 * Hobby routes
 */

// POST /api/hobbies - Create new hobby
router.post('/', HobbyController.createHobby)

// DELETE /api/hobbies/:userId/:hobby - Delete hobby
router.delete('/:userId/:hobby', HobbyController.deleteHobby)

// GET /api/users/:userId/hobbies - Get hobbies for user
router.get('/user/:userId', HobbyController.getUserHobbies)

export default router
