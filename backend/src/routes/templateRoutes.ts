// src/routes/templateRoutes.ts
import { Router } from 'express'
import {
  getTemplates,
  getTemplate,
  getTemplateByCategory,
} from '../controllers/templateController'

const router = Router()

// Routes publiques - pas besoin d'authentification
router.get('/', getTemplates)
router.get('/category/:category', getTemplateByCategory)
router.get('/:id', getTemplate)

export default router