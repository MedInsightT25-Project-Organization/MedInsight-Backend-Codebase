'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'audit_logs',
      [
        {
          user_id: 1,
          action: 'User login',
          ip_address: '192.168.1.100',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          action: 'Profile updated',
          ip_address: '203.0.113.42',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('audit_logs', null, {})
  },
}
