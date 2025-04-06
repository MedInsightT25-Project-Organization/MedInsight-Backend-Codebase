'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { User } = queryInterface.sequelize.models

    // Get a patient
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'patient' LIMIT 1"
    )

    await queryInterface.bulkInsert(
      'insurance',
      [
        {
          patient_id: patients[0].id,
          provider: 'Blue Cross Blue Shield',
          policy_number: 'BCBS-2024-001',
          policy_type: 'health',
          coverage_start: new Date(),
          coverage_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          premium_amount: 500.0,
          deductible: 1000.0,
          copay: 25.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          patient_id: patients[0].id,
          provider: 'Delta Dental',
          policy_number: 'DD-2024-001',
          policy_type: 'dental',
          coverage_start: new Date(),
          coverage_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          premium_amount: 50.0,
          deductible: 100.0,
          copay: 15.0,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('insurance', null, {})
  },
}
