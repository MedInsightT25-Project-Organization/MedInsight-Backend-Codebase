const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const { sequelize } = require('../../config/database')
const basename = path.basename(__filename)

const db = {}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      !file.endsWith('.test.js')
    )
  })
  .forEach((file) => {
    const modelPath = path.join(__dirname, file)
    const modelDefiner = require(modelPath)

    if (typeof modelDefiner !== 'function') {
      console.error(
        `[ERROR] Skipping model "${file}": export is not a function (got: ${typeof modelDefiner})`
      )
      return
    }

    try {
      const model = modelDefiner(sequelize, Sequelize.DataTypes)
      db[model.name] = model
    } catch (err) {
      console.error(
        `[ERROR] Failed to initialize model "${file}":`,
        err.message
      )
    }
  })

Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

// const fs = require('fs/promises')
// const path = require('path')
// const Sequelize = require('sequelize')
// const process = require('process')
// const basename = path.basename(__filename)
// const {sequelize} = require('../../config/database')
// const db = {}

// // Load all models
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     )
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     )
//     db[model.name] = model
//   })

// // Set up associations
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db)
//   }
// })

// // User associations
// db.User.associate = (models) => {
//   // User has one Profile
//   db.User.hasOne(models.UserProfile, {
//     foreignKey: 'userId',
//     as: 'userProfile',
//   })

//   // User has one Preference
//   db.User.hasOne(models.UserPreference, {
//     foreignKey: 'userId',
//     as: 'userPreference',
//   })

//   // User has many Vitals
//   db.User.hasMany(models.PatientVitals, {
//     foreignKey: 'patientId',
//     as: 'vitals',
//   })

//   // User has many Notifications
//   db.User.hasMany(models.Notification, {
//     foreignKey: 'userId',
//     as: 'notifications',
//   })

//   // User has many Appointments
//   db.User.hasMany(models.Appointment, {
//     foreignKey: 'patientId',
//     as: 'appointments',
//   })

//   // User has many Prescriptions
//   db.User.hasMany(models.Prescription, {
//     foreignKey: 'patientId',
//     as: 'prescriptions',
//   })

//   // User has many Messages
//   db.User.hasMany(models.Message, {
//     foreignKey: 'senderId',
//     as: 'sentMessages',
//   })

//   // User has many Messages
//   db.User.hasMany(models.Message, {
//     foreignKey: 'receiverId',
//     as: 'receivedMessages',
//   })

//   // User has many Ratings
//   db.User.hasMany(models.Rating, {
//     foreignKey: 'userId',
//     as: 'ratings',
//   })

//   // User has many Payments
//   db.User.hasMany(models.Payment, {
//     foreignKey: 'userId',
//     as: 'payments',
//   })

//   // User has many CartItems
//   db.User.hasMany(models.CartItem, {
//     foreignKey: 'userId',
//     as: 'cartItems',
//   })
// }

// // Hospital associations
// db.Hospital.associate = (models) => {
//   // Hospital has many Services
//   db.Hospital.hasMany(models.Service, {
//     foreignKey: 'hospitalId',
//     as: 'services',
//   })

//   // Hospital has many Appointments
//   db.Hospital.hasMany(models.Appointment, {
//     foreignKey: 'hospitalId',
//     as: 'appointments',
//   })

//   // Hospital has many Ratings
//   db.Hospital.hasMany(models.Rating, {
//     foreignKey: 'hospitalId',
//     as: 'ratings',
//   })
// }

// // Service associations
// db.Service.associate = (models) => {
//   // Service belongs to Hospital
//   db.Service.belongsTo(models.Hospital, {
//     foreignKey: 'hospitalId',
//     as: 'hospital',
//   })
// }

// // Appointment associations
// db.Appointment.associate = (models) => {
//   // Appointment belongs to User (Patient)
//   db.Appointment.belongsTo(models.User, {
//     foreignKey: 'patientId',
//     as: 'patient',
//   })

//   // Appointment belongs to Hospital
//   db.Appointment.belongsTo(models.Hospital, {
//     foreignKey: 'hospitalId',
//     as: 'hospital',
//   })
// }

// // Notification associations
// db.Notification.associate = (models) => {
//   // Notification belongs to User
//   db.Notification.belongsTo(models.User, {
//     foreignKey: 'userId',
//     as: 'user',
//   })
// }

// // Message associations
// db.Message.associate = (models) => {
//   // Message belongs to User (Sender)
//   db.Message.belongsTo(models.User, {
//     foreignKey: 'senderId',
//     as: 'sender',
//   })

//   // Message belongs to User (Receiver)
//   db.Message.belongsTo(models.User, {
//     foreignKey: 'receiverId',
//     as: 'receiver',
//   })
// }

// // Rating associations
// db.Rating.associate = (models) => {
//   // Rating belongs to User
//   db.Rating.belongsTo(models.User, {
//     foreignKey: 'userId',
//     as: 'user',
//   })

//   // Rating belongs to Hospital
//   db.Rating.belongsTo(models.Hospital, {
//     foreignKey: 'hospitalId',
//     as: 'hospital',
//   })
// }

// // Payment associations
// db.Payment.associate = (models) => {
//   // Payment belongs to User
//   db.Payment.belongsTo(models.User, {
//     foreignKey: 'userId',
//     as: 'user',
//   })
// }

// // CartItem associations
// db.CartItem.associate = (models) => {
//   // CartItem belongs to User
//   db.CartItem.belongsTo(models.User, {
//     foreignKey: 'userId',
//     as: 'user',
//   })
// }

// db.sequelize = sequelize
// db.Sequelize = Sequelize

// module.exports = db
