'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('test_results', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false, // URL to the test report (e.g., PDF, image)
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional notes about the test
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'appointments', // Links to appointments table
          key: 'id',
        },
        allowNull: false,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('test_results')
  },
}
