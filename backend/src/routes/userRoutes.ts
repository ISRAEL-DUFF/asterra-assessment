import { Router } from 'express'
import { UserController } from '../controllers'

const router = Router()
 
router.get('/', UserController.getAllUsers)
router.get('/with-hobbies/all', UserController.getUsersWithHobbies)
router.get('/:userId', UserController.getUserById)
router.post('/', UserController.createUser)
router.delete('/:userId', UserController.deleteUser)

export default router
