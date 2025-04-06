'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('test_result', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      test_type: {
        type: Sequelize.ENUM(
          'blood_test',
          'mri',
          'x_ray',
          'urinalysis',
          'biopsy',
          'ecg'
        ),
        allowNull: false,
      },
      result_data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'abnormal'),
        defaultValue: 'pending',
      },
      test_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      file_url: {
        type: Sequelize.STRING,
      },
      medical_record_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medical_record',
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
      appointment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'appointment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('test_result', ['medical_record_id'], {
      name: 'test_result_medical_record_id_idx',
    })
    await queryInterface.addIndex('test_result', ['practitioner_id'], {
      name: 'test_result_practitioner_id_idx',
    })
    await queryInterface.addIndex('test_result', ['appointment_id'], {
      name: 'test_result_appointment_id_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('test_result')
  },
}
