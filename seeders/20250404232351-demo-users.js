// migrations/XXXXXX-create-users.js
'use strict'
const { hashPassword } = require('../utils/auth')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    if (process.env.NODE_ENV !== 'production') {
      console.log('Seeding demo users...')
      console.log('Hashing password...')
      await queryInterface.bulkInsert(
        'users',
        [
          {
            full_name: 'Admin User',
            email: 'admin@medinsight.com',
            password_hash: await hashPassword('admin123'), // Replace with actual hash
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            full_name: 'John Patient',
            email: 'john@example.com',
            password_hash: await hashPassword('password123'),
            role: 'patient',
            phone_number: '+1234567890',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            full_name: 'Dr. Sarah Smith',
            email: 'sarah@medinsight.com',
            password_hash: await hashPassword('password123'),
            role: 'practitioner',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      )
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'users',
      { email: 'admin@medinsight.com' },
      { email: 'john@example.com' },
      { email: 'sarah@medinsight.com' },
      {}
    )
    await queryInterface.dropTable('users')
  },
}
