'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'practitioner' LIMIT 2"
    )

    const [departments] = await queryInterface.sequelize.query(
      'SELECT id FROM departments LIMIT 2'
    )

    await queryInterface.bulkInsert(
      'practitioner_departments',
      [
        {
          practitioner_id: practitioners[0].id,
          department_id: departments[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          practitioner_id: practitioners[1].id,
          department_id: departments[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('practitioner_departments', null, {})
  },
}
