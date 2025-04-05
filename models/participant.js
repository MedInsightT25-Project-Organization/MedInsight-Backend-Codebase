const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Participant = sequelize.define(
  'Participant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM('member', 'admin'),
      defaultValue: 'member',
    },
    conversationId: {
      type: DataTypes.INTEGER,
      field: 'conversation_id',
      allowNull: false,
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
    tableName: 'participants',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

Participant.associate = (models) => {
  Participant.belongsTo(models.Conversation, {
    foreignKey: 'conversation_id',
  })
  Participant.belongsTo(models.User, {
    foreignKey: 'user_id',
  })
}
