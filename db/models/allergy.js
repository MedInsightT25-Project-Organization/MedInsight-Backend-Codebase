const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Allergy = sequelize.define(
  'allergy',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
  },
  {
    tableName: 'allergies',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Allergy.associate = (models) => {
  // Allergy belongs to a Patient (User)
  Allergy.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })
}

module.exports = Allergy
