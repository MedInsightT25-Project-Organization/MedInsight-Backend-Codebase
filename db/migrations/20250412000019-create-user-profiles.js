'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_profiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dob: {
        type: Sequelize.DATEONLY, // Stores date only (YYYY-MM-DD)
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING, // e.g., "male", "female", "non-binary"
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Links to users table
          key: 'id',
        },
        allowNull: false,
        unique: true, // Ensures 1:1 relationship
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
    await queryInterface.dropTable('user_profiles')
  },
}
