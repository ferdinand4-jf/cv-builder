// src/server.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { errorHandler } from '../src/middlewares/errorHandler'
import { authMiddleware } from '../src/middlewares/auth'

// Import routes
import authRoutes from '../src/routes/authRoutes'
import cvRoutes from '../src/routes/cvRoutes'
import templateRoutes from '../src/routes/templateRoutes'
import userRoutes from '../src/routes/userRoutes'
import adminRoutes from '../src/routes/adminRoutes'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
})

// Configuration CORS améliorée
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  process.env.FRONTEND_URL
].filter(Boolean) as string[]

// Middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true)
    }
    
    // En développement, on permet toutes les origines
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true)
    }
    
    // En production, on vérifie que l'origine est autorisée
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

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

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
app.use('/api/templates', templateRoutes) // Assurez-vous que cette route est avant authMiddleware si elle est publique
app.use('/api/users', authMiddleware as express.RequestHandler, userRoutes)
app.use('/api/admin', authMiddleware as express.RequestHandler, adminRoutes)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

export { app, prisma }