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
      validate: {
        notEmpty: true,
        isUrl: true,
      },
    },
    fileType: {
      type: DataTypes.ENUM('image', 'pdf', 'video', 'document'),
      field: 'file_type',
      allowNull: false,
      validate: {
        isIn: [['image', 'pdf', 'video', 'document']],
      },
    },
    fileName: {
      type: DataTypes.STRING,
      field: 'file_name',
      validate: {
        notEmpty: true,
      },
    },
    messageId: {
      type: DataTypes.INTEGER,
      field: 'message_id',
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
    tableName: 'attachment',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Attachment.associate = (models) => {
  Attachment.belongsTo(models.Message, {
    foreignKey: 'message_id',
    as: 'Message',
  })
}

module.exports = Attachment
