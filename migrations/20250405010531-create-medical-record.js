'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('medical_record', {
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
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      practitioner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
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

    await queryInterface.addIndex('medical_record', ['patient_id'], {
      name: 'medical_record_patient_id_idx',
    })
    await queryInterface.addIndex('medical_record', ['practitioner_id'], {
      name: 'medical_record_practitioner_id_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('medical_record')
  },
}
