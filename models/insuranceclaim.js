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
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'denied', 'processed'),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'approved', 'denied', 'processed']],
      },
    },
    claimNumber: {
      type: DataTypes.STRING,
      field: 'claim_number',
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    paymentId: {
      type: DataTypes.INTEGER,
      field: 'payment_id',
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    insuranceId: {
      type: DataTypes.INTEGER,
      field: 'insurance_id',
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
    tableName: 'insurance_claim',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
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

module.exports = InsuranceClaim
