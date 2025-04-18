const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const { testConnection } = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const hospitalRoutes = require('./routes/hospitalRoutes')
const logRoutes = require('./routes/logRoutes')
const { errorHandler, errorTypeHandler } = require('./middleware/errorHandler')
const { NotFoundError } = require('./utils/errors')
const { logger } = require('./utils/logger')

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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
app.use('/api/hospitals', hospitalRoutes)

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

// Catch-all route for undefined routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`))
})

// Global error handling
app.use((err, req, res, next) => {
  err = errorTypeHandler(err)
  errorHandler(err, req, res, next)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...')
  logger.error(err.name, err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  logger.error(err.name, err.message)
  process.exit(1)
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
