import { Router } from 'express'
import { UserController } from '../controllers'

const router = Router()
 
/**
 * User routes
 */

// GET /api/users - Get all users
router.get('/', UserController.getAllUsers)

// GET /api/users/with-hobbies/all - Get all users with hobbies (MUST come before /:userId)
router.get('/with-hobbies/all', UserController.getUsersWithHobbies)

// GET /api/users/:userId - Get user by ID
router.get('/:userId', UserController.getUserById)

// POST /api/users - Create new user
router.post('/', UserController.createUser)

// DELETE /api/users/:userId - Delete user
router.delete('/:userId', UserController.deleteUser)

export default router
