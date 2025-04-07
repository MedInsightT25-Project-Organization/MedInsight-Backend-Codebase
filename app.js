const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const { testConnection } = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const logRoutes = require('./routes/logRoutes')

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import logger after Redis is initialized
const { logger } = require('./utils/logger')

// Request logging middleware
app.use((req, res, next) => {
  logger.info(
    `${req.method} ${req.url} - IP: ${req.ip} - User-Agent: ${req.get(
      'user-agent'
    )}`
  )
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/logs', logRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MedInsight API is running',
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested resource was not found',
  })
})

// Start server
app.listen(port, async () => {
  // Test database connection
  await testConnection()

  logger.info(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  )
})

module.exports = app
