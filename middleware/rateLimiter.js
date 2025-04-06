const redis = require('../config/redis')
const logger = require('../utils/logger')

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip
    const key = `rate_limit:${ip}`
    const window = parseInt(process.env.RATE_LIMIT_WINDOW) || 15 // 15 minutes
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100

    // Get current request count
    const current = await redis.get(key)
    const count = current ? parseInt(current) : 0

    if (count >= maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`)
      return res.status(429).json({
        error: 'Too many requests, please try again later',
      })
    }

    // Increment request count
    await redis.set(key, count + 1, 'EX', window * 60)

    next()
  } catch (error) {
    logger.error('Rate limiter error:', error)
    next() // Continue even if rate limiting fails
  }
}

module.exports = {
  rateLimiter,
}
