// migrations/XXXXXX-create-users.js
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
      if (process.env.NODE_ENV !== 'production') {
      await queryInterface.bulkInsert(
        'hospitals',
        [
          {
            name: 'City General Hospital',
            address: '123 Medical Drive',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            contact_number: '+1 212-555-1234',
            geolocation: Sequelize.fn('ST_MakePoint', -74.006, 40.7128),
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            name: 'West-side Medical Center',
            address: '456 Health Avenue',
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA',
            contact_number: '+1 310-555-5678',
            geolocation: Sequelize.fn('ST_MakePoint', -118.2437, 34.0522),
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      )
    }
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('hospitals', null, {})
    await queryInterface.dropTable('hospitals')
  },
}
