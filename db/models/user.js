const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      field: 'password_hash',
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('patient', 'hospital_admin', 'super_admin'),
      defaultValue: 'patient',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isVerified: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasCompletedProfile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFirstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isPhoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isTwoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isTwoFactorEnabled: {
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
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  }
)

// Define relationships
User.associate = (models) => {
  // 1:1 Relationships
  User.hasOne(models.UserProfile, { foreignKey: 'user_id' })
  User.hasOne(models.UserPreference, { foreignKey: 'user_id' })

  // 1:N Relationships
  User.hasMany(models.Appointment, { foreignKey: 'patient_id' })
  User.hasMany(models.Message, { foreignKey: 'sender_id' })
  User.hasMany(models.Notification, { foreignKey: 'user_id' })
  User.hasMany(models.Prescription, { foreignKey: 'patient_id' })
  User.hasMany(models.Allergy, { foreignKey: 'patient_id' })
  User.hasMany(models.PatientVitals, { foreignKey: 'patient_id' })
  User.hasMany(models.Rating, { foreignKey: 'patient_id' })
  User.hasMany(models.ResearchRequest, { foreignKey: 'user_id' })

  // Hospital Admin Relationship
  User.hasMany(models.Hospital, { foreignKey: 'created_by' })
}

module.exports = User