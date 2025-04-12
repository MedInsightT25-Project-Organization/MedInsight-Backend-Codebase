const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const UserProfile = sequelize.define(
  'user_profile',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      field: 'full_name',
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    gender: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    contactNumber: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    occupation: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    nextOfKin: {
      type: DataTypes.STRING,
    },
    nextOfKinContactNumber: {
      type: DataTypes.STRING,
    },    
    nextOfKinRelationship: {
      type: DataTypes.STRING,
    },
    nextOfKinAddress: {
      type: DataTypes.STRING,
    },
    nextOfKinEmail: {
      type: DataTypes.STRING,
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
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
    as: 'user',
  })
}

module.exports = UserProfile
