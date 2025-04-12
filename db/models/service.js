const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Service = sequelize.define(
  'service',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
  },
  {
    tableName: 'services',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Service.associate = (models) => {
  // Service belongs to a Hospital
  Service.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })

  // Service can be in many CartItems (define later)
  Service.hasMany(models.CartItem, { foreignKey: 'service_id' })
}

module.exports = Service
