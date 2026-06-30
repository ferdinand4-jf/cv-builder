import dotenv from 'dotenv'
import { app } from './server'
import { prisma } from './server'

dotenv.config()

const PORT = process.env.PORT || 5000

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server')
  await prisma.$disconnect()
  process.exit(0)
})

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 API available at http://localhost:${PORT}/api`)
  console.log(`❤️  Health check at http://localhost:${PORT}/health`)
})

export { server, prisma }