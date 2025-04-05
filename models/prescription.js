const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Prescription = sequelize.define(
  'Prescription',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    medication: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
    },
    medicalRecordId: {
      type: DataTypes.INTEGER,
      field: 'medical_record_id',
      allowNull: false,
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      field: 'practitioner_id',
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
    tableName: 'prescriptions',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Prescription.associate = (models) => {
  Prescription.belongsTo(models.MedicalRecord, {
    foreignKey: 'medical_record_id',
    as: 'MedicalRecord',
  })

  Prescription.belongsTo(models.User, {
    foreignKey: 'practitioner_id',
    as: 'Practitioner',
  })
}

module.exports = Prescription
