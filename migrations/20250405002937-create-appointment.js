'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('consultation', 'test', 'follow-up', 'surgery'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
      },
      notes: {
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
      hospital_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hospitals',
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

    await queryInterface.addIndex('appointments', ['appointment_date'])
    await queryInterface.addIndex('appointments', ['status'])
    await queryInterface.addIndex('appointments', ['patient_id'])
    await queryInterface.addIndex('appointments', ['practitioner_id'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('appointments')
  },
}
