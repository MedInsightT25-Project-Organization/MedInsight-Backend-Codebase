'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('insurance_claim', {
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
        allowNull: false,
      },
      payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      insurance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'insurance',
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })

    await queryInterface.addIndex('insurance_claim', ['payment_id'], {
      name: 'insurance_claim_payment_id_idx',
    })
    await queryInterface.addIndex('insurance_claim', ['insurance_id'], {
      name: 'insurance_claim_insurance_id_idx',
    })
    await queryInterface.addIndex('insurance_claim', ['claim_number'], {
      name: 'insurance_claim_claim_number_idx',
      unique: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('insurance_claim')
  },
}
