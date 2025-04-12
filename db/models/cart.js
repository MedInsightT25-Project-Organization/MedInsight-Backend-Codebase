const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Cart = sequelize.define(
  'cart',
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
    tableName: 'carts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Cart.associate = (models) => {
  // Cart belongs to a Patient (User)
  Cart.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'patient',
  })

  // Cart belongs to a Hospital
  Cart.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })

  // Cart has many CartItems (to be defined next)
  Cart.hasMany(models.CartItem, {
    foreignKey: 'cart_id',
    as: 'items',
  })
}

module.exports = Cart
