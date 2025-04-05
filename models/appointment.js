const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class Appointment extends Model {}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      field: 'appointment_date',
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('consultation', 'test', 'follow-up', 'surgery'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      field: 'practitioner_id',
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
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
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    underscored: true,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
)

Appointment.associate = (models) => {
  Appointment.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'Patient',
  })

  Appointment.belongsTo(models.User, {
    foreignKey: 'practitioner_id',
    as: 'Practitioner',
  })

  Appointment.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
  })

  Appointment.belongsToMany(models.Service, {
    through: 'appointment_services',
    foreignKey: 'appointment_id',
  })
}

module.exports = Appointment
