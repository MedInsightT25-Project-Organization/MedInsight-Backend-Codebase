const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Payment = sequelize.define(
  'payment',
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
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING,
      field: 'transaction_id',
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
  },
  {
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Relationships
Payment.associate = (models) => {
  // Payment belongs to an Appointment
  Payment.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
    as: 'appointment',
  })

  // Payment belongs to a Patient (User)
  Payment.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'patient',
  })

  // Payment belongs to a Hospital
  Payment.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'hospital',
  })
}

module.exports = Payment
