const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    scheduledDate: {
      type: DataTypes.DATE,
      field: 'scheduled_date',
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
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

CartItem.associate = (models) => {
  CartItem.belongsTo(models.Cart, {
    foreignKey: 'cart_id',
    as: 'Cart',
  })

  CartItem.belongsTo(models.Service, {
    foreignKey: 'service_id',
    as: 'Service',
  })

  CartItem.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'Hospital',
  })
}

module.exports = CartItem
