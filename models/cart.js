const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      defaultValue: 'active',
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
    tableName: 'cart',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

Cart.associate = (models) => {
  Cart.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'User',
  })

  Cart.hasMany(models.CartItem, {
    foreignKey: 'cart_id',
    as: 'Items',
  })
}

module.exports = Cart
