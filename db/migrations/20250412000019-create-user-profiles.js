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
        allowNull: false,
      },  
      dob: {
        type: Sequelize.DATEONLY, // Stores date only (YYYY-MM-DD)
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING, // e.g., "male", "female", "non-binary"
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      local_government: {
        type: Sequelize.STRING,
        allowNull: false,
      },  
      emergency_contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emergency_contact_number: {
        type: Sequelize.STRING,
        allowNull: false,
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
