const jwt = require('jsonwebtoken')
const { User } = require('../db/models/user')
const { AuthenticationError, AuthorizationError } = require('../utils/errors')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided')
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      throw new AuthenticationError('User not found')
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    throw new AuthenticationError('Invalid token')
  }
}

const isPatient = (req, res, next) => {
  if (req.user.role !== 'patient') {
  throw new AuthorizationError('Unauthorized')
  }
  next()
}

const isHospitalAdmin = (req, res, next) => {
  if (req.user.role !== 'hospital_admin') {
    throw new AuthorizationError('Unauthorized')
  }
  next()
}

const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    throw new AuthorizationError('Unauthorized')
  }
  next()
}

const authorizeRole = (...role) => {
  return (req, res, next) => {
    if (!req.user || !role.includes(req.user.role)) {
      throw new AuthorizationError('Unauthorized')
    }
    next()
  }
}
module.exports = {
  authenticate,
  authorizeRole,
  isPatient,
  isHospitalAdmin,
  isSuperAdmin,
}
