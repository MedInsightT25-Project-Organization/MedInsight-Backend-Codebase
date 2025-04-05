const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const AuditLog = sequelize.define(
  'AuditLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      field: 'ip_address',
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
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

AuditLog.associate = (models) => {
  AuditLog.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  })
}

module.exports = AuditLog
