import { Router, type RequestHandler } from 'express'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getStatistics,
} from '../controllers/adminController'
import { authMiddleware, adminMiddleware } from '../middlewares/auth'
import { validate } from '../middlewares/validation'
import {
  updateUserValidation,
  createTemplateValidation,
  updateTemplateValidation,
} from '../utils/validators'

const router = Router()
const toRequestHandler = (handler: unknown) => handler as RequestHandler

// User management
router.get('/users', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), toRequestHandler(getUsers))
router.get('/users/:id', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), toRequestHandler(getUser))
router.put('/users/:id', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), validate(updateUserValidation), toRequestHandler(updateUser))
router.delete('/users/:id', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), toRequestHandler(deleteUser))

// Template management
router.post('/templates', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), validate(createTemplateValidation), toRequestHandler(createTemplate))
router.put('/templates/:id', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), validate(updateTemplateValidation), toRequestHandler(updateTemplate))
router.delete('/templates/:id', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), toRequestHandler(deleteTemplate))

// Statistics
router.get('/statistics', toRequestHandler(authMiddleware), toRequestHandler(adminMiddleware), toRequestHandler(getStatistics))

export default router