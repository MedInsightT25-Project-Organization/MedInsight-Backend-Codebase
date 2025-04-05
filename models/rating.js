const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewType: {
      type: DataTypes.ENUM('practitioner', 'hospital', 'service'),
      field: 'review_type',
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    review: {
      type: DataTypes.TEXT,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      field: 'practitioner_id',
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
    },
    serviceId: {
      type: DataTypes.INTEGER,
      field: 'service_id',
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
    tableName: 'ratings',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

Rating.associate = (models) => {
  Rating.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'Patient',
  })

  Rating.belongsTo(models.User, {
    foreignKey: 'practitioner_id',
    as: 'Practitioner',
  })

  Rating.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
  })

  Rating.belongsTo(models.Service, {
    foreignKey: 'service_id',
  })
}

module.exports = Rating
