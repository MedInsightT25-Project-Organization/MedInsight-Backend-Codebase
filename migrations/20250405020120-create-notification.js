'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('unread', 'read', 'archived'),
        defaultValue: 'unread',
      },
      type: {
        type: Sequelize.ENUM('appointment', 'payment', 'message', 'system'),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.INTEGER,
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

    await queryInterface.addIndex('notifications', ['user_id'])
    await queryInterface.addIndex('notifications', ['status'])
    await queryInterface.addIndex('notifications', ['type'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('notifications')
  },
}
