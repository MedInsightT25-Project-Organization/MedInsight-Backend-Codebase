const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const UserPreference = sequelize.define(
  'user_preference',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
      allowNull: false,
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      field: 'dark_mode',
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      unique: true, // Enforces 1:1 relationship
    },
  },
  {
    tableName: 'user_preferences',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
UserPreference.associate = (models) => {
  // Preference belongs to a User (1:1)
  UserPreference.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  })
}

module.exports = UserPreference
