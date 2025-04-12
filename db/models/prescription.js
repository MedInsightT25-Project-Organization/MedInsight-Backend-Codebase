const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Prescription = sequelize.define(
  'prescription',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    medications: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      allowNull: true,
    },
  },
  {
    tableName: 'prescriptions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Prescription.associate = (models) => {
  // Prescription belongs to a Patient (User)
  Prescription.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })

  // Prescription belongs to a Hospital
  Prescription.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })

  // Prescription optionally linked to an Appointment
  Prescription.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
    as: 'appointment',
  })
}

module.exports = Prescription
