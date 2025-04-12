const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Rating = sequelize.define(
  'rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
  },
  {
    tableName: 'ratings',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Rating.associate = (models) => {
  // Rating belongs to a Patient (User)
  Rating.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })

  // Rating belongs to a Hospital
  Rating.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })
}

module.exports = Rating
