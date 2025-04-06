'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('health_metric', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      metric_type: {
        type: Sequelize.ENUM(
          'blood_pressure',
          'weight',
          'height',
          'bmi',
          'heart_rate',
          'blood_glucose'
        ),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recorded_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
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

    await queryInterface.addIndex('health_metric', ['user_id'], {
      name: 'health_metric_user_id_idx',
    })
    await queryInterface.addIndex('health_metric', ['metric_type'], {
      name: 'health_metric_metric_type_idx',
    })
    await queryInterface.addIndex('health_metric', ['recorded_at'], {
      name: 'health_metric_recorded_at_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('health_metric')
  },
}
