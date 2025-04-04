'use strict'
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

module.exports =  (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      full_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      role: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      is_featured: DataTypes.BOOLEAN,
      is_approved: DataTypes.BOOLEAN,
      is_deleted: DataTypes.BOOLEAN,
      is_blocked: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  )
  User.associate = function (models) {
    User.hasMany(models.Appointment, { foreignKey: 'patient_id' })
    User.hasMany(models.Appointment, { foreignKey: 'practitioner_id' })
    User.hasMany(models.Payment, { foreignKey: 'patient_id' })
    User.hasMany(models.Rating, { foreignKey: 'patient_id' })
    User.hasMany(models.Notification, { foreignKey: 'user_id' })
    User.hasOne(models.UserSetting, { foreignKey: 'user_id' })
  }
  return User
}
