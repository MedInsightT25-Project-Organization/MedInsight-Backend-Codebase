'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medical_records', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Links to patients (users table)
          key: 'id',
        },
        allowNull: false,
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'appointments',
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
    await queryInterface.dropTable('medical_records')
  },
}
