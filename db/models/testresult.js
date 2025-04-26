// const { DataTypes } = require('sequelize')
// const {sequelize} = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
const TestResult = sequelize.define(
  'TestResult',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      field: 'file_url',
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      allowNull: false,
    },
  },
  {
    tableName: 'test_results',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
TestResult.associate = (models) => {
  // TestResult belongs to an Appointment
  TestResult.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
    as: 'appointment',
  })
}

return TestResult}
