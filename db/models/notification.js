const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Notification = sequelize.define(
  'notification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      field: 'is_read',
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
  },
  {
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Notification.associate = (models) => {
  // Notification belongs to a User
  Notification.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  })
}

module.exports = Notification
