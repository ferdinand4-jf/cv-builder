import { Router, RequestHandler } from 'express'
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/userController'
import { authMiddleware } from '../middlewares/auth'
import { validate } from '../middlewares/validation'
import {
  updateProfileValidation,
  changePasswordValidation,
  deleteAccountValidation,
} from '../utils/validators'

const router = Router()

// cast to RequestHandler to satisfy Express typings when middleware returns a Promise
router.use(authMiddleware as RequestHandler)

router.put('/profile', validate(updateProfileValidation), updateProfile as RequestHandler)
router.post('/change-password', validate(changePasswordValidation), changePassword as RequestHandler)
router.delete('/account', validate(deleteAccountValidation), deleteAccount as RequestHandler)

export default router