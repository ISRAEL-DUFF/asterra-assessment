import { Router } from 'express'
import { HobbyController } from '../controllers'

const router = Router()

router.post('/', HobbyController.createHobby)
router.delete('/:userId/:hobby', HobbyController.deleteHobby)
router.get('/user/:userId', HobbyController.getUserHobbies)

export default router
