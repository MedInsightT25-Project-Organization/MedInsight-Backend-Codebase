// const { DataTypes } = require('sequelize')
// const { sequelize } = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
const Hospital = sequelize.define(
  'Hospital',
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
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    localGovernmentArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceSummary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workHours: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'created_by',
      allowNull: false,
    },
    hospitalPicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registeredNumber: {
      type: DataTypes.STRING,
      field: 'registered_number',
      allowNull: true,
    },
    registrationCertificate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'hospitals',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  }
)

// Relationships
Hospital.associate = (models) => {
  // Hospital belongs to a User (hospital_admin)
  Hospital.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'hospitalAdmin',
  })

  // Hospital has many Services/Appointments (define later)
  Hospital.hasMany(models.Service, { foreignKey: 'hospital_id' , as: 'services' })
  Hospital.hasMany(models.Appointment, { foreignKey: 'hospital_id' , as: 'appointments' })
  Hospital.hasMany(models.Cart, { foreignKey: 'hospital_id' , as: 'carts' })
  Hospital.hasMany(models.Conversation, { foreignKey: 'hospital_id' , as: 'conversations' })
  Hospital.hasMany(models.Message, { foreignKey: 'hospital_id' , as: 'messages' })
  Hospital.hasMany(models.CartItem, { foreignKey: 'hospital_id' , as: 'cartItems' })
  Hospital.hasMany(models.Rating, { foreignKey: 'hospital_id' , as: 'ratings' })
  Hospital.hasMany(models.Notification, { foreignKey: 'created_by' , as: 'notifications' })
}

return  Hospital}
