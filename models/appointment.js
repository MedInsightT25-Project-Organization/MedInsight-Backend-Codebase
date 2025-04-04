'use strict';
const {
  Model, DataTypes  
} = require('sequelize');
const sequelize = require('../config/database')

module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'appointment',
    {
      patient_id: DataTypes.INTEGER,
      practitioner_id: DataTypes.INTEGER,
      hospital_id: DataTypes.INTEGER,
      appointment_date: DataTypes.DATE,
      status: DataTypes.STRING,
      notes: DataTypes.TEXT,
      is_active: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      is_featured: DataTypes.BOOLEAN,
      is_approved: DataTypes.BOOLEAN,
      is_deleted: DataTypes.BOOLEAN,
      is_blocked: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'appointment',
      tableName: 'appointment',
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  )
  Appointment.associate = function (models) {
    Appointment.belongsTo(models.User, {
      foreignKey: 'patient_id',
      as: 'Patient',
    })
    Appointment.belongsTo(models.User, {
      foreignKey: 'practitioner_id',
      as: 'Practitioner',
    })
    Appointment.belongsTo(models.Hospital, { foreignKey: 'hospital_id' })
    Appointment.hasOne(models.Payment, { foreignKey: 'appointment_id' })
  }
  return Appointment
}
