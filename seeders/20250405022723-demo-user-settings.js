'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [users] = await queryInterface.sequelize.query('SELECT id FROM users')

    await queryInterface.bulkInsert(
      'user_settings',
      users.map((user) => ({
        user_id: user.id,
        notifications_enabled: true,
        privacy_settings: { profile_visible: true, medical_history: false },
        theme: 'light',
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_settings', null, {})
  },
}