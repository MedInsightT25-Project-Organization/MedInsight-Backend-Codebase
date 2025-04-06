const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const MedicalRecord = sequelize.define(
  'MedicalRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prescription: {
      type: DataTypes.TEXT,
    },
    testResults: {
      type: DataTypes.TEXT,
      field: 'test_results',
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
    tableName: 'medical_record',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

MedicalRecord.associate = (models) => {
  MedicalRecord.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'Patient',
  })

  MedicalRecord.belongsTo(models.User, {
    foreignKey: 'practitioner_id',
    as: 'Practitioner',
  })
}

module.exports = MedicalRecord
