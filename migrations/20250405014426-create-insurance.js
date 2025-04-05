'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('insurances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      policy_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      coverage_type: {
        type: Sequelize.ENUM('basic', 'premium', 'comprehensive'),
        defaultValue: 'basic',
      },
      valid_from: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      valid_until: {
        type: Sequelize.DATEONLY,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })

    await queryInterface.addIndex('insurances', ['user_id'])
    await queryInterface.addIndex('insurances', ['policy_number'], {
      unique: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('insurances')
  },
}
