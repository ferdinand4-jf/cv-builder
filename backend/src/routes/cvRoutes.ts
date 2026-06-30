import { Router, RequestHandler } from 'express'
import {
  createCV,
  getCVs,
  getCV,
  updateCV,
  deleteCV,
  generateCVPDF,
  duplicateCV,
} from '../controllers/cvController'
import { authMiddleware } from '../middlewares/auth'
import { validate } from '../middlewares/validation'
import { createCVValidation, updateCVValidation } from '../utils/validators'

const router = Router()

router.use(authMiddleware as RequestHandler)

router.get('/', getCVs as RequestHandler)
router.post('/', validate(createCVValidation), createCV as RequestHandler)
router.get('/:id', getCV as RequestHandler)
router.put('/:id', validate(updateCVValidation), updateCV as RequestHandler)
router.delete('/:id', deleteCV as RequestHandler)
router.post('/:id/duplicate', duplicateCV as RequestHandler)
router.get('/:id/pdf', generateCVPDF as RequestHandler)

export default router