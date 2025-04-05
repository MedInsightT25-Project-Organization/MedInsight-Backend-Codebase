const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Notification = sequelize.define(
  'Notification',
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
    status: {
      type: DataTypes.ENUM('unread', 'read', 'archived'),
      defaultValue: 'unread',
    },
    type: {
      type: DataTypes.ENUM('appointment', 'payment', 'message', 'system'),
      allowNull: false,
    },
    referenceId: {
      type: DataTypes.INTEGER,
      field: 'reference_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
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
  },
  {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

Notification.associate = (models) => {
  Notification.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'User',
  })
}

module.exports = Notification
