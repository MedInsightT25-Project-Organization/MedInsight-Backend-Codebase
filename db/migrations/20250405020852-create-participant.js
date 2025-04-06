'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('participant', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: Sequelize.ENUM('member', 'admin'),
        defaultValue: 'member',
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
    })

    await queryInterface.addIndex('participant', ['conversation_id'], {
      name: 'participant_conversation_id_idx',
    })
    await queryInterface.addIndex('participant', ['user_id'], {
      name: 'participant_user_id_idx',
    })
    await queryInterface.addConstraint('participant', {
      fields: ['conversation_id', 'user_id'],
      type: 'unique',
      name: 'participant_unique_idx',
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('participant')
  },
}
