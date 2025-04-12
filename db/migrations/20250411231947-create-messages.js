'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sent_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'conversations',
          key: 'id',
        },
        allowNull: false,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('messages')
  },
}
