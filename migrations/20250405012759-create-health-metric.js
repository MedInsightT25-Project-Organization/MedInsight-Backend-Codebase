'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('health_metrics', {
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

    await queryInterface.addIndex('health_metrics', ['user_id'])
    await queryInterface.addIndex('health_metrics', ['metric_type'])
    await queryInterface.addIndex('health_metrics', ['recorded_at'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('health_metrics')
  },
}
