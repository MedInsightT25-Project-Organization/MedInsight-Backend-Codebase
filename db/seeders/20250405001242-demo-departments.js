'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [hospitals] = await queryInterface.sequelize.query(
      "SELECT id FROM hospitals WHERE name IN ('City General Hospital', 'Westside Medical Center')"
    )

    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'practitioner'"
    )

    await queryInterface.bulkInsert(
      'departments',
      [
        {
          name: 'Cardiology',
          hospital_id: hospitals[0].id,
          head_practitioner_id: practitioners[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Orthopedics',
          hospital_id: hospitals[1].id,
          head_practitioner_id: practitioners[1]?.id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Pediatrics',
          hospital_id: hospitals[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('departments', null, {})
  },
}
