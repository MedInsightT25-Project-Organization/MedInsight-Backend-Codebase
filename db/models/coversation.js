const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Conversation = sequelize.define(
  'conversation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
  },
  {
    tableName: 'conversations',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Conversation.associate = (models) => {
  // Conversation belongs to a Patient (User)
  Conversation.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })

  // Conversation belongs to a Hospital
  Conversation.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })

  // Conversation has many Messages
  Conversation.hasMany(models.Message, {
    foreignKey: 'conversation_id',
    as: 'messages',
  })
}

module.exports = Conversation
