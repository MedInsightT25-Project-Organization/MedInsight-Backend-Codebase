const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const MedicalRecord = sequelize.define(
  'medical_record',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      allowNull: false,
    },
  },
  {
    tableName: 'medical_records',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
MedicalRecord.associate = (models) => {
  // MedicalRecord belongs to a Patient (User)
  MedicalRecord.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })

  // MedicalRecord belongs to an Appointment
  MedicalRecord.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
    as: 'appointment',
  })
}

module.exports = MedicalRecord
