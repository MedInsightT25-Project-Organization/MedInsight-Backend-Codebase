const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Conversation = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('direct', 'group', 'support'),
      defaultValue: 'direct',
    },
    title: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'created_by',
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
    tableName: 'conversations',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Conversation.associate = (models) => {
  Conversation.hasMany(models.Participant, {
    foreignKey: 'conversation_id',
  })
  Conversation.hasMany(models.Message, {
    foreignKey: 'conversation_id',
  })
}
