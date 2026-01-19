import { Router, Request, Response } from 'express'
import userRoutes from './userRoutes'
import hobbyRoutes from './hobbyRoutes'

const router = Router()

/**
 * Health check endpoint
 */
router.get('/health', (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  })
})

/**
 * API routes
 */
router.use('/users', userRoutes)
router.use('/hobbies', hobbyRoutes)

export default router
