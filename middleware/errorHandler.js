const { logger } = require('../utils/logger')
const { AppError } = require('../utils/errors')

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Log error
  logger.error(
    `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  )
  if (err.stack) {
    logger.error(err.stack)
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  } else {
    // Production mode
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    } else {
      // Programming or other unknown error: don't leak error details
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      })
    }
  }
}

// Handle specific error types
const handleSequelizeValidationError = (err) => {
  const message = `Invalid input data. ${err.errors
    .map((e) => e.message)
    .join('. ')}`
  return new AppError(message, 400)
}

const handleSequelizeUniqueConstraintError = (err) => {
  const message = `Duplicate field value: ${err.errors
    .map((e) => e.value)
    .join(', ')}. Please use another value.`
  return new AppError(message, 400)
}

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401)

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401)

// Error type handler
const errorTypeHandler = (err) => {
  if (err.name === 'SequelizeValidationError')
    return handleSequelizeValidationError(err)
  if (err.name === 'SequelizeUniqueConstraintError')
    return handleSequelizeUniqueConstraintError(err)
  if (err.name === 'JsonWebTokenError') return handleJWTError()
  if (err.name === 'TokenExpiredError') return handleJWTExpiredError()
  return err
}

module.exports = {
  errorHandler,
  errorTypeHandler,
}
