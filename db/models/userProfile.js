// const { DataTypes } = require('sequelize')
// const { sequelize } = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
const UserProfile = sequelize.define(
  'UserProfile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      field: 'full_name',
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    localGovernment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emergencyContactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinContactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinRelationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextOfKinEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      unique: true, // Enforces 1:1 relationship
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
    tableName: 'user_profiles',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
UserProfile.associate = (models) => {
  // Profile belongs to a User (1:1)
  UserProfile.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'userProfile',
  })
  // Profile has many Research Requests (1:N)
  UserProfile.hasMany(models.ResearchRequest, {
    foreignKey: 'user_id',
    as: 'researchRequests',
  })
}

return UserProfile }  
