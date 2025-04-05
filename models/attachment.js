const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Attachment = sequelize.define(
  'Attachment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      field: 'file_url',
      allowNull: false,
    },
    fileType: {
      type: DataTypes.ENUM('image', 'pdf', 'video', 'document'),
      field: 'file_type',
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      field: 'file_name',
    },
    messageId: {
      type: DataTypes.INTEGER,
      field: 'message_id',
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
    tableName: 'attachments',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

Attachment.associate = (models) => {
  Attachment.belongsTo(models.Message, {
    foreignKey: 'message_id',
    as: 'Message',
  })
}