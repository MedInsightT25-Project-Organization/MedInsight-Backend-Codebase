const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const UserSetting = sequelize.define(
  'UserSetting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      field: 'notifications_enabled',
      defaultValue: true,
    },
    privacySettings: {
      type: DataTypes.JSON,
      field: 'privacy_settings',
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'light',
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      unique: true,
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
    tableName: 'user_settings',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

UserSetting.associate = (models) => {
  UserSetting.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'User',
  })
}

module.exports = UserSetting
