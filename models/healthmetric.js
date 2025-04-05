const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const HealthMetric = sequelize.define(
  'HealthMetric',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    metricType: {
      type: DataTypes.ENUM(
        'blood_pressure',
        'weight',
        'height',
        'bmi',
        'heart_rate',
        'blood_glucose'
      ),
      field: 'metric_type',
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recordedAt: {
      type: DataTypes.DATE,
      field: 'recorded_at',
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
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
  },
  {
    tableName: 'health_metrics',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

HealthMetric.associate = (models) => {
  HealthMetric.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'Patient',
  })
}

module.exports = HealthMetric
