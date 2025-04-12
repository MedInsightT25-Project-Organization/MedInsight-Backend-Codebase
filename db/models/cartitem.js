const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const CartItem = sequelize.define(
  'cart_item',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cartId: {
      type: DataTypes.INTEGER,
      field: 'cart_id',
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      field: 'service_id',
      allowNull: false,
    },
  },
  {
    tableName: 'cart_items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
CartItem.associate = (models) => {
  // CartItem belongs to a Cart
  CartItem.belongsTo(models.Cart, {
    foreignKey: 'cart_id',
    as: 'cart',
  })

  // CartItem belongs to a Service
  CartItem.belongsTo(models.Service, {
    foreignKey: 'service_id',
    as: 'service',
  })
}

module.exports = CartItem
