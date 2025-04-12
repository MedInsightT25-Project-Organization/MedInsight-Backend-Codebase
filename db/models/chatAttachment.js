const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const ChatAttachment = sequelize.define(
  'chat_attachment',
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
      type: DataTypes.STRING,
      field: 'file_type',
    },
    messageId: {
      type: DataTypes.INTEGER,
      field: 'message_id',
      allowNull: false,
    },
  },
  {
    tableName: 'chat_attachments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
ChatAttachment.associate = (models) => {
  // Attachment belongs to a Message
  ChatAttachment.belongsTo(models.Message, {
    foreignKey: 'message_id',
    as: 'message',
  })
}

module.exports = ChatAttachment
