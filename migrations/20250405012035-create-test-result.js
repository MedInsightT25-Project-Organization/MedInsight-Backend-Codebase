'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('test_results', {
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
          model: 'medical_records',
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
      appointment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'appointments',
          key: 'id',
        },
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

    await queryInterface.addIndex('test_results', ['medical_record_id'])
    await queryInterface.addIndex('test_results', ['practitioner_id'])
    await queryInterface.addIndex('test_results', ['appointment_id'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('test_results')
  },
}
