const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('credit_card', 'upi', 'insurance', 'cash'),
      field: 'payment_method',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING,
      field: 'transaction_id',
      unique: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: 'patient_id',
      allowNull: false,
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
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
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
)

Payment.associate = (models) => {
  Payment.belongsTo(models.User, {
    foreignKey: 'patient_id',
    as: 'Patient',
  })

  Payment.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
    as: 'Appointment',
  })
}

module.exports = Payment