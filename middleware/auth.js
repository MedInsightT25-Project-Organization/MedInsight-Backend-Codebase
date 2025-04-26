const jwt = require('jsonwebtoken')
const db = require('../db/models/index')
const User = db.User
const { AuthenticationError, AuthorizationError } = require('../utils/errors')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided')
    }

    const token = authHeader.split(' ')[1]
    console.log('Token:', token)
    if (!token) {
      throw new AuthenticationError('No token provided')
    }

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
    next(new AuthenticationError('Invalid token'))
  }
}

const isPatient = (req, res, next) => {
  if (req.user.role !== 'patient' && req.user.role !== 'super_admin') {
    throw new AuthorizationError('Unauthorized')
  }
  next()
}


const isHospitalAdmin = (req, res, next) => {
  if (req.user.role !== 'hospital_admin' && req.user.role !== 'super_admin') {
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
