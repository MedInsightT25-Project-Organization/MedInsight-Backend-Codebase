'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification', {
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

    await queryInterface.addIndex('notification', ['user_id'], {
      name: 'notification_user_id_idx',
    })
    await queryInterface.addIndex('notification', ['status'], {
      name: 'notification_status_idx',
    })
    await queryInterface.addIndex('notification', ['type'], {
      name: 'notification_type_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('notification')
  },
}
