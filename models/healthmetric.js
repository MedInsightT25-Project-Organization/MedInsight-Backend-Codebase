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
      validate: {
        isIn: [
          [
            'blood_pressure',
            'weight',
            'height',
            'bmi',
            'heart_rate',
            'blood_glucose',
          ],
        ],
      },
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    recordedAt: {
      type: DataTypes.DATE,
      field: 'recorded_at',
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      validate: {
        isInt: true,
      },
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
    tableName: 'health_metric',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

HealthMetric.associate = (models) => {
  HealthMetric.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'Patient',
  })
}

module.exports = HealthMetric
