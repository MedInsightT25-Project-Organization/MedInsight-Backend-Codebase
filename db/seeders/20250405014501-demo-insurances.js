'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'insurances',
      [
        {
          provider: 'HealthGuard Inc.',
          policy_number: 'HG-2023-001',
          coverage_type: 'premium',
          valid_from: '2023-01-01',
          valid_until: '2024-12-31',
          user_id: patients[0].id,
        },
        {
          provider: 'MediShield',
          policy_number: 'MS-2023-005',
          coverage_type: 'basic',
          valid_from: '2023-06-01',
          valid_until: '2024-05-31',
          user_id: patients[1].id,
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('insurances', null, {})
  },
}
