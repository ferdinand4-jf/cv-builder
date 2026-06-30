import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { errorHandler } from './src/middlewares/errorHandler'
import { authMiddleware } from './src/middlewares/auth'

// Import routes
import authRoutes from './src/routes/authRoutes'
import cvRoutes from './src/routes/cvRoutes'
import templateRoutes from './src/routes/templateRoutes'
import userRoutes from './src/routes/userRoutes'
import adminRoutes from './src/routes/adminRoutes'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: 'Too many requests from this IP, please try again later.',
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Apply rate limiting to all API routes
app.use('/api', limiter)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/cvs', authMiddleware, cvRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/admin', authMiddleware, adminRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use(errorHandler)

export { app, prisma }