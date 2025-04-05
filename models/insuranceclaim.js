const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const InsuranceClaim = sequelize.define(
  'InsuranceClaim',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    claimAmount: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'claim_amount',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'denied', 'processed'),
      defaultValue: 'pending',
    },
    claimNumber: {
      type: DataTypes.STRING,
      field: 'claim_number',
      unique: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      field: 'payment_id',
      allowNull: false,
    },
    insuranceId: {
      type: DataTypes.INTEGER,
      field: 'insurance_id',
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
    tableName: 'insurance_claims',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

InsuranceClaim.associate = (models) => {
  InsuranceClaim.belongsTo(models.Insurance, {
    foreignKey: 'insurance_id',
    as: 'InsurancePolicy',
  })

  InsuranceClaim.belongsTo(models.Payment, {
    foreignKey: 'payment_id',
    as: 'Payment',
  })
}