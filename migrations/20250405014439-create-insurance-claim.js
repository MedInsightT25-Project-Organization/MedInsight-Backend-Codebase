'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('insurance_claims', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      claim_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'denied', 'processed'),
        defaultValue: 'pending',
      },
      claim_number: {
        type: Sequelize.STRING,
        unique: true,
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      insurance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'insurances',
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

    await queryInterface.addIndex('insurance_claims', ['payment_id'])
    await queryInterface.addIndex('insurance_claims', ['insurance_id'])
    await queryInterface.addIndex('insurance_claims', ['claim_number'], {
      unique: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('insurance_claims')
  },
}
