import { Router, RequestHandler } from 'express'
import {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController'
import { authMiddleware } from '../middlewares/auth'
import { validate } from '../middlewares/validation'
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../utils/validators'

const router = Router()

router.post('/register', validate(registerValidation), register)
router.post('/login', validate(loginValidation), login)
router.post('/refresh', refreshToken)
router.post('/logout', logout)
router.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword)
router.post('/reset-password', validate(resetPasswordValidation), resetPassword)
// cast middleware to any to satisfy express RequestHandler typing mismatch
router.get('/me', authMiddleware as any, getMe as RequestHandler)

export default router