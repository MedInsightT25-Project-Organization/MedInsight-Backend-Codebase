// const { DataTypes } = require('sequelize')
// const {sequelize} = require('../../config/database')
module.exports = (sequelize, DataTypes) => {
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
    sentAt: {
      type: DataTypes.DATE,
      field: 'sent_at',
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
  },
  {
    tableName: 'messages',
    underscored: true,
    timestamps: false, // Uses sent_at instead of default timestamps
  }
)

// Relationships
Message.associate = (models) => {
  // Message belongs to a Conversation
  Message.belongsTo(models.Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation',
  })

  // Message belongs to a Sender (User)
  Message.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender',
  })

  // Message can have attachments
  Message.hasMany(models.ChatAttachment, {
    foreignKey: 'message_id',
    as: 'attachments',
  })
}

return Message}
