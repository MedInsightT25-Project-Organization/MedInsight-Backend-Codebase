const { Sequelize } = require('sequelize')
require('dotenv').config()
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: (msg) => console.log(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
)

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection established successfully')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

module.exports = {
  sequelize,
  testConnection,
}
