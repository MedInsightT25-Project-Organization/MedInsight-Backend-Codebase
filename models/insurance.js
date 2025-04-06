const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Insurance = sequelize.define(
  'Insurance',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    policyNumber: {
      type: DataTypes.STRING,
      field: 'policy_number',
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    coverageType: {
      type: DataTypes.ENUM('basic', 'premium', 'comprehensive'),
      field: 'coverage_type',
      defaultValue: 'basic',
      validate: {
        isIn: [['basic', 'premium', 'comprehensive']],
      },
    },
    validFrom: {
      type: DataTypes.DATEONLY,
      field: 'valid_from',
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    validUntil: {
      type: DataTypes.DATEONLY,
      field: 'valid_until',
      allowNull: false,
      validate: {
        isDate: true,
        isAfterValidFrom(value) {
          if (value <= this.validFrom) {
            throw new Error('Valid until date must be after valid from date')
          }
        },
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
    tableName: 'insurance',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Insurance.associate = (models) => {
  Insurance.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'PolicyHolder',
  })

  Insurance.hasMany(models.InsuranceClaim, {
    foreignKey: 'insurance_id',
    as: 'Claims',
  })
}

module.exports = Insurance
