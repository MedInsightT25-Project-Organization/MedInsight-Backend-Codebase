'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role IN ('patient', 'practitioner') LIMIT 3"
    )

    await queryInterface.bulkInsert(
      'conversations',
      [
        {
          type: 'direct',
          created_by: users[0].id,
        },
        {
          type: 'group',
          title: 'Diabetes Support Group',
          created_by: users[2].id,
        },
      ],
      {}
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('conversations', null, {})
  },
}
