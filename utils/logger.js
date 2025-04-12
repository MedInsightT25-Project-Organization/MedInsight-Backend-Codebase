const winston = require('winston')
const { cacheClient } = require('../config/redis')

// Custom Redis transport for Winston
class RedisTransport extends winston.Transport {
  constructor(opts) {
    super(opts)
    this.key = opts.key || 'logs'
    this.maxLogs = opts.maxLogs || 10000 // Maximum number of logs to keep
    this.redisAvailable = true
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info)
    })

    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level: info.level,
      message: info.message,
      ...info,
    })

    // Only try to log to Redis if it's available
    if (this.redisAvailable) {
      // Add to the beginning of the list (newest first)
      cacheClient
        .lpush(this.key, logEntry)
        .then(() => {
          // Trim the list to maxLogs
          return cacheClient.ltrim(this.key, 0, this.maxLogs - 1)
        })
        .then(() => {
          callback()
        })
        .catch((err) => {
          // If Redis fails, mark it as unavailable and continue
          this.redisAvailable = false
          console.error('Redis logging failed:', err)
          callback()
        })
    } else {
      // If Redis is not available, just call the callback
      callback()
    }
  }
}

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Write all logs to Redis
    new RedisTransport({
      key: 'app:logs',
      maxLogs: 10000,
    }),
  ],
})

// If we're not in production, log to the console with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}

// Helper function to retrieve logs from Redis
const getLogs = async (limit = 100, level = null) => {
  try {
    let logs = await redis.lrange('app:logs', 0, limit - 1)

    // Parse the logs
    logs = logs.map((log) => JSON.parse(log))

    // Filter by level if specified
    if (level) {
      logs = logs.filter((log) => log.level === level)
    }

    return logs
  } catch (error) {
    console.error('Error retrieving logs from Redis:', error)
    return []
  }
}

// Helper function to clear logs
const clearLogs = async () => {
  try {
    await redis.del('app:logs')
    return true
  } catch (error) {
    console.error('Error clearing logs from Redis:', error)
    return false
  }
}

module.exports = {
  logger,
  getLogs,
  clearLogs,
}
