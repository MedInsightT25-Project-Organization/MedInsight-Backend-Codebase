const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const AppointmentService = sequelize.define(
  'AppointmentService',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      field: 'service_id',
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: 'appointment_service',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

AppointmentService.associate = (models) => {
  AppointmentService.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
  })
  AppointmentService.belongsTo(models.Service, {
    foreignKey: 'service_id',
  })
}

module.exports = AppointmentService
