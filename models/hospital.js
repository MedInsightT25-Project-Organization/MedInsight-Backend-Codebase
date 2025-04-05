const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class Hospital extends Model {}

Hospital.init(
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
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
    },
    state: {
      type: DataTypes.STRING(100),
    },
    country: {
      type: DataTypes.STRING(100),
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      field: 'contact_number',
    },
    geolocation: {
      type: DataTypes.GEOGRAPHY('POINT'),
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
    modelName: 'Hospital',
    tableName: 'hospitals',
    underscored: true,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
)

Hospital.associate = (models) => {
  Hospital.hasMany(models.Department, {
    foreignKey: 'hospital_id',
  })
  Hospital.hasMany(models.Appointment, {
    foreignKey: 'hospital_id',
  })
  Hospital.hasMany(models.Service, {
    foreignKey: 'hospital_id',
  })
}

module.exports = Hospital
