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

    if (this.redisAvailable) {
      cacheClient
        .lpush(this.key, logEntry)
        .then(() => cacheClient.ltrim(this.key, 0, this.maxLogs - 1))
        .then(() => callback())
        .catch((err) => {
          this.redisAvailable = false
          console.error('Redis logging failed:', err)
          callback()
        })
    } else {
      callback()
    }
  }
}

// Create base logger with console transport
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
})

// Initialize Redis transport asynchronously
const initializeRedisTransport = async () => {
  try {
    await cacheClient.ping()
    logger.add(
      new RedisTransport({
        key: 'app:logs',
        maxLogs: 10000,
      })
    )
    console.log('Redis logging enabled')
  } catch (err) {
    console.error('Redis not available for logging:', err)
  }
}

// Start Redis transport initialization
initializeRedisTransport().catch(console.error)

// Helper function to retrieve logs from Redis
const getLogs = async (limit = 100, level = null) => {
  try {
    let logs = await cacheClient.lrange('app:logs', 0, limit - 1)
    logs = logs.map((log) => JSON.parse(log))
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
    await cacheClient.del('app:logs')
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
