'use strict';
const {
  Model, DataTypes
} = require('sequelize');
const sequelize = require('../config/database')

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    'payment',
    {
      patient_id: DataTypes.INTEGER,
      appointment_id: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL,
      payment_method: DataTypes.STRING,
      transaction_id: DataTypes.STRING,
      status: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_verified: DataTypes.BOOLEAN,
      is_featured: DataTypes.BOOLEAN,
      is_approved: DataTypes.BOOLEAN,
      is_deleted: DataTypes.BOOLEAN,  
    },
    {
      sequelize,
      modelName: 'payment',
      tableName: 'payment',
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  )
  Payment.associate = function (models) {
    Payment.belongsTo(models.User, { foreignKey: 'patient_id' })
    Payment.belongsTo(models.Appointment, { foreignKey: 'appointment_id' })
  }
  return Payment
}
