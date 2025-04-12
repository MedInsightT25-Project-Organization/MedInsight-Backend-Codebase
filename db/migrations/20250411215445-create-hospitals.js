'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hospitals', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Links to users table
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
    await queryInterface.dropTable('hospitals')
  },
}
