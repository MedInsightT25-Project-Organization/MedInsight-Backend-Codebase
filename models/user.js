// models/user.js
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      field: 'phone_number',
    },
    role: {
      type: DataTypes.ENUM('patient', 'practitioner', 'admin'),
      defaultValue: 'patient',
    },
    profilePicture: {
      type: DataTypes.STRING,
      field: 'profile_picture',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  })

User.associate = (models) => {
  User.hasMany(models.Appointment, {
    as: 'PatientAppointments',
    foreignKey: 'patient_id',
  })

  User.hasMany(models.Appointment, {
    as: 'PractitionerAppointments',
    foreignKey: 'practitioner_id',
  })

  User.hasMany(models.MedicalRecord, {
    foreignKey: 'patient_id',
  })

  User.hasMany(models.Rating, {
    foreignKey: 'patient_id',
  })

  User.hasOne(models.Cart, {
    foreignKey: 'user_id',
  })

  User.hasMany(models.Notification, {
    foreignKey: 'user_id',
  })

  User.hasMany(models.Message, {
    foreignKey: 'sender_id',
  })

  User.hasMany(models.Participant, {
    foreignKey: 'user_id',
  })

  User.hasOne(models.Insurance, {
    foreignKey: 'user_id',
  })

  User.hasMany(models.Allergy, {
    foreignKey: 'user_id',
  })

  User.hasMany(models.HealthMetric, {
    foreignKey: 'user_id',
  })

  User.hasOne(models.UserSetting, {
    foreignKey: 'user_id',
  })
}

module.exports = User
