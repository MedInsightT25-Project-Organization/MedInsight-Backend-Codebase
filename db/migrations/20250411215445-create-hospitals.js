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
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      localGovernmentArea: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactEmail: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      serviceSummary: {
        type: Sequelize.STRING,
        allowNull: false ,
      },
      workHours: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // Links to users table
          key: 'id',
        },
        allowNull: false,
      },
      registeredNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registrationCertificate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      hospitalPicture: {
        type: Sequelize.STRING,
        allowNull: true,
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
