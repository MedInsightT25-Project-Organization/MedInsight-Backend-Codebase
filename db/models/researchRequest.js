const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const ResearchRequest = sequelize.define(
  'research_request',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
  },
  {
    tableName: 'research_requests',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
ResearchRequest.associate = (models) => {
  // Request belongs to a User (requester)
  ResearchRequest.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'requester',
  })
}

module.exports = ResearchRequest
