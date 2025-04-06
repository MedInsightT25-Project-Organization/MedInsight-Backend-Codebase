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
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'archived'),
      defaultValue: 'unread',
      validate: {
        isIn: [['unread', 'read', 'archived']],
      },
    },
    type: {
      type: DataTypes.ENUM('appointment', 'payment', 'message', 'system'),
      allowNull: false,
      validate: {
        isIn: [['appointment', 'payment', 'message', 'system']],
      },
    },
    referenceId: {
      type: DataTypes.INTEGER,
      field: 'reference_id',
      validate: {
        isInt: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
      validate: {
        isInt: true,
      },
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
    tableName: 'notification',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Notification.associate = (models) => {
  Notification.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'User',
  })
}

module.exports = Notification
