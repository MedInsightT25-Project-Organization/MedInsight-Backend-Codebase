'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'carts',
      [
        {
          user_id: patients[0].id,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: patients[1].id,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('carts', null, {})
  },
}
