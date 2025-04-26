'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patient_vitals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      heart_rate: {
        type: Sequelize.INTEGER,
        allowNull: true, // Optional field
      },
      blood_pressure: {
        type: Sequelize.STRING,
        allowNull: true, // e.g., "120/80"
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2), // Supports up to 999.99 kg/lbs
        allowNull: true,
      },
      body_temperature: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: true
      },
      recorded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      patient_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Links to patients (users table)
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
    await queryInterface.dropTable('patient_vitals')
  },
}
