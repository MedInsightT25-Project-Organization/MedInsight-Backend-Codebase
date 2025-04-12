'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_profiles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: true,
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
      contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true,
      },  
      next_of_kin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      next_of_kin_contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      next_of_kin_relationship: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      next_of_kin_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      next_of_kin_email: {
        type: Sequelize.STRING,
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
