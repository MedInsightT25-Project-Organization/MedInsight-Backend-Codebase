const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class Service extends Model {}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      field: 'category_id',
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
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  },
  {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    underscored: true,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
)

Service.associate = (models) => {
  Service.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'Hospital',
  })

  Service.belongsTo(models.ServiceCategory, {
    foreignKey: 'category_id',
    as: 'Category',
  })

  Service.belongsToMany(models.Appointment, {
    through: 'appointment_services',
    foreignKey: 'service_id',
  })
}

module.exports = Service
