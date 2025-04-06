const Redis = require('ioredis')
const logger = require('../utils/logger')
const env = process.env.NODE_ENV || 'development'
const config = require('./config')[env]


const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  // password: config.redis.password,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

redis.on('connect', () => {
  logger.info('Redis connected successfully')
})

redis.on('error', (error) => {
  logger.error('Redis connection error:', error)
})

module.exports = redis
