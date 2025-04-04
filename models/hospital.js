'use strict';
const {
  Model, DataTypes
} = require('sequelize')
const sequelize = require('../config/database')

module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define(
    'hospital',
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      contact_number: DataTypes.STRING,
      email: DataTypes.STRING,
      website: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      is_active: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      is_featured: DataTypes.BOOLEAN,
      is_approved: DataTypes.BOOLEAN,
      is_deleted: DataTypes.BOOLEAN,
      is_blocked: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'hospital',
      tableName: 'hospital',
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  )
  Hospital.associate = function (models) {
    Hospital.hasMany(models.Appointment, { foreignKey: 'hospital_id' })
  }
  return Hospital
}
