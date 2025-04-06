const jwt = require('jsonwebtoken')
const { User } = require('../db/models/user')
const logger = require('../utils/logger')

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Add user to request
    req.user = user
    next()
  } catch (error) {
    logger.error('Authentication error:', error)
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = {
  authenticate,
}
