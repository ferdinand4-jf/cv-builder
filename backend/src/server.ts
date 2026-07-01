// src/server.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { errorHandler } from '@/middlewares/errorHandler'
import { authMiddleware } from '@/middlewares/auth'

// Import routes
import authRoutes from '@/routes/authRoutes'
import cvRoutes from '@/routes/cvRoutes'
import templateRoutes from '@/routes/templateRoutes'
import userRoutes from '@/routes/userRoutes'
import adminRoutes from '@/routes/adminRoutes'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
})

// Origines autorisées par le CORS (Ajout explicite de Nginx http://localhost)
const allowedOrigins = [
  'http://localhost',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL
].filter(Boolean) as string[]

// Middleware CORS unifié
app.use(cors({
  origin: (origin, callback) => {
    // Autorise les requêtes sans origine (comme Postman ou curl)
    if (!origin) return callback(null, true)
    
    // Mode développement
    if (process.env.NODE_ENV === 'development') return callback(null, true)
    
    // Vérification de l'origine
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log(`❌ CORS blocked: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 200
}))

// Middleware Helmet configuré pour ne pas écraser les entêtes CSP de Nginx
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Serve static files (Gestion robuste des chemins)
const uploadsPath = path.isAbsolute('../uploads') ? '../uploads' : path.join(__dirname, '../uploads')
app.use('/uploads', express.static(uploadsPath))

// Apply rate limiting to all API routes
app.use('/api', limiter)

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/cvs', authMiddleware as express.RequestHandler, cvRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/users', authMiddleware as express.RequestHandler, userRoutes)
app.use('/api/admin', authMiddleware as express.RequestHandler, adminRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

export { app, prisma }