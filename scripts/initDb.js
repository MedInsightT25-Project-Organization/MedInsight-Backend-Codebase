const { sequelize } = require('../config/database')
const logger = require('../utils/logger')

// Import all models
const User = require('../models/user')
const UserSetting = require('../models/usersetting')
const Allergy = require('../models/allergy')
const Conversation = require('../models/conversation')
const Participant = require('../models/participant')
const AppointmentService = require('../models/appointmentservice')

const initDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' })
    logger.info('Database synchronized successfully')

    // If in development, seed the database
    if (process.env.NODE_ENV === 'development') {
      // Import seeders
      const seedHospitals = require('../db/seeders/20250404234959-demo-hospitals')

      // Run seeders
      await seedHospitals.up(sequelize.getQueryInterface(), Sequelize)
      logger.info('Database seeded successfully')
    }

    process.exit(0)
  } catch (error) {
    logger.error('Error initializing database:', error)
    process.exit(1)
  }
}

// Run initialization
initDatabase()
