// const { DataTypes } = require('sequelize')
// const { sequelize } = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
const Appointment = sequelize.define(
  'Appointment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
      defaultValue: 'pending',
    },
    scheduledTime: {
      type: DataTypes.DATE,
      field: 'scheduled_time',
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      field: 'service_id',
      allowNull: true,
    },
  },
  {
    tableName: 'appointments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Appointment.associate = (models) => {
  // Appointment belongs to a Patient (User)
  Appointment.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })

  // Appointment belongs to a Hospital
  Appointment.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })

  //Appointment to MedicalRecord
  Appointment.hasOne(models.MedicalRecord, {
    foreignKey: 'appointment_id',
    as: 'medicalRecord',
  })

  // Appointment optionally belongs to a Service
  Appointment.belongsTo(models.Service, {
    foreignKey: 'service_id',
    as: 'service',
  })

  // Appointment has one Payment (define later)
  Appointment.hasOne(models.Payment, { foreignKey: 'appointment_id' })
}

return Appointment}
