'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attachment', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_type: {
        type: Sequelize.ENUM('image', 'pdf', 'video', 'document'),
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
      },
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'message',
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

    await queryInterface.addIndex('attachment', ['message_id'], {
      name: 'attachment_message_id_idx',
    })
    await queryInterface.addIndex('attachment', ['file_type'], {
      name: 'attachment_file_type_idx',
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('attachment')
  },
}
