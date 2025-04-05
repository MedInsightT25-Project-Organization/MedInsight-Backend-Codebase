'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medical_records', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      prescription: {
        type: Sequelize.TEXT,
      },
      test_results: {
        type: Sequelize.TEXT,
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
      practitioner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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

    await queryInterface.addIndex('medical_records', ['patient_id'])
    await queryInterface.addIndex('medical_records', ['practitioner_id'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('medical_records')
  },
}
