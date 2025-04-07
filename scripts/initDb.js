const { sequelize } = require('../config/database')

// Import all models
const User = require('../db/models/user')
const UserSetting = require('../db/models/usersetting')
const Allergy = require('../db/models/allergy')
const Conversation = require('../db/models/conversation')
const Participant = require('../db/models/participant')
const AppointmentService = require('../db/models/appointmentservice')

const initDatabase = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' })
    console.log('Database synchronized successfully')

    // If in development, seed the database
    if (process.env.NODE_ENV === 'development') {
      // Import seeders
      const seedHospitals = require('../db/seeders/20250404234959-demo-hospitals')

      // Run seeders
      await seedHospitals.up(sequelize.getQueryInterface(), Sequelize)
      console.log('Database seeded successfully')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

// Run initialization
initDatabase()
