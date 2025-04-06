const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

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
      validate: {
        isIn: [['practitioner', 'hospital', 'service']],
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
    review: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 1000], // Maximum 1000 characters for review
      },
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      field: 'practitioner_id',
      validate: {
        isInt: true,
      },
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      validate: {
        isInt: true,
      },
    },
    serviceId: {
      type: DataTypes.INTEGER,
      field: 'service_id',
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
    tableName: 'rating',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
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
    as: 'Hospital',
  })

  Rating.belongsTo(models.Service, {
    foreignKey: 'service_id',
    as: 'Service',
  })
}

module.exports = Rating
