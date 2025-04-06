'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hospital', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      contact_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      geolocation: {
        type: Sequelize.GEOGRAPHY('POINT'),
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })

    // Add spatial index for geolocation
    await queryInterface.addIndex('hospital', ['geolocation'], {
      using: 'GIST',
      name: 'idx_hospital_geolocation',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('hospital', 'idx_hospital_geolocation')
    await queryInterface.dropTable('hospital')
  },
}
