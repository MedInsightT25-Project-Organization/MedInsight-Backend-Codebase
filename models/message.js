const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Message = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent',
    },
    conversationId: {
      type: DataTypes.INTEGER,
      field: 'conversation_id',
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      field: 'sender_id',
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
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'messages',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Message.associate = (models) => {
  Message.belongsTo(models.Conversation, {
    foreignKey: 'conversation_id',
    as: 'Conversation',
  })

  Message.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'Sender',
  })

  Message.hasMany(models.Attachment, {
    foreignKey: 'message_id',
    as: 'Attachments',
  })
}
