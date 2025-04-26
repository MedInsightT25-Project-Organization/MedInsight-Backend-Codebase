// const { DataTypes } = require('sequelize')
// const {sequelize} = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
const AdminBroadcast = sequelize.define(
  'AdminBroadcast',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sentAt: {
      type: DataTypes.DATE,
      field: 'sent_at',
    },
  },
  {
    tableName: 'admin_broadcasts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// No direct relationships needed (system-wide broadcasts)
return AdminBroadcast}
