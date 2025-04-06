'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('insurance', {
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

    // Add check constraint for valid dates
    await queryInterface.addConstraint('insurance', {
      fields: ['valid_from', 'valid_until'],
      type: 'check',
      name: 'insurance_valid_dates_check',
      where: {
        valid_until: {
          [Sequelize.Op.gt]: Sequelize.col('valid_from'),
        },
      },
    })

    await queryInterface.addIndex('insurance', ['user_id'], {
      name: 'insurance_user_id_idx',
    })
    await queryInterface.addIndex('insurance', ['policy_number'], {
      name: 'insurance_policy_number_idx',
      unique: true,
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('insurance')
  },
}
