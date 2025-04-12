'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat_attachments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false, // URL to the file (e.g., S3 bucket path)
      },
      file_type: {
        type: Sequelize.STRING, // e.g., "image/png", "application/pdf"
        allowNull: true,
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'messages', // Links to messages table
          key: 'id',
        },
        allowNull: false,
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('chat_attachments')
  },
}
