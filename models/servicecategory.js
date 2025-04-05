const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class ServiceCategory extends Model {}

ServiceCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: 'ServiceCategory',
    tableName: 'service_categories',
    underscored: true,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
)

ServiceCategory.associate = (models) => {
  ServiceCategory.hasMany(models.Service, {
    foreignKey: 'category_id',
    as: 'Services',
  })
}

module.exports = ServiceCategory
