// const { DataTypes } = require('sequelize')
// const {sequelize} = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
const PatientVitals = sequelize.define(
  'PatientVitals',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    heartRate: {
      type: DataTypes.INTEGER,
      field: 'heart_rate',
    },
    bloodPressure: {
      type: DataTypes.STRING,
      field: 'blood_pressure',
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
    },
    bodyTemperature: {
      type: DataTypes.DECIMAL(4, 1),
      field: 'body_temperature',
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'recorded_at',
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
  },
  {
    tableName: 'patient_vitals',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
PatientVitals.associate = (models) => {
  // Vitals belong to a Patient (User)
  PatientVitals.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'vitals',
  })
}

return PatientVitals}
