'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('credit_card', 'upi', 'insurance', 'cash'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      transaction_id: {
        type: Sequelize.STRING,
        unique: true,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'appointments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.addIndex('payments', ['patient_id'])
    await queryInterface.addIndex('payments', ['appointment_id'])
    await queryInterface.addIndex('payments', ['transaction_id'], {
      unique: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('payments')
  },
}