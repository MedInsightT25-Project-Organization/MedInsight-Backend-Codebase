'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('message', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('sent', 'delivered', 'read'),
        defaultValue: 'sent',
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'conversation',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      sender_id: {
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

    await queryInterface.addIndex('message', ['conversation_id'], {
      name: 'message_conversation_id_idx',
    })
    await queryInterface.addIndex('message', ['sender_id'], {
      name: 'message_sender_id_idx',
    })
    await queryInterface.addIndex('message', ['status'], {
      name: 'message_status_idx',
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('message')
  },
}
