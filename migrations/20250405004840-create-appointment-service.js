'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointment_service', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'appointment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'service',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      notes: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('appointment_service', ['appointment_id'], {
      name: 'appointment_service_appointment_id_idx',
    })
    await queryInterface.addIndex('appointment_service', ['service_id'], {
      name: 'appointment_service_service_id_idx',
    })
    await queryInterface.addIndex(
      'appointment_service',
      ['appointment_id', 'service_id'],
      { unique: true, name: 'appointment_service_unique_idx' }
    )
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('appointment_service')
  },
}
