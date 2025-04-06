'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { User, Insurance } = queryInterface.sequelize.models

    // Get a patient
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'patient' LIMIT 1"
    )

    // Get an insurance policy
    const insurance = await Insurance.findOne()

    await queryInterface.bulkInsert(
      'insurance_claim',
      [
        {
          patient_id: patients[0].id,
          insurance_id: insurance.id,
          claim_number: 'CLM-2024-001',
          claim_type: 'medical',
          status: 'pending',
          amount: 1500.0,
          description: 'Annual checkup and lab tests',
          submitted_at: new Date(),
          processed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          patient_id: patients[0].id,
          insurance_id: insurance.id,
          claim_number: 'CLM-2024-002',
          claim_type: 'dental',
          status: 'approved',
          amount: 500.0,
          description: 'Dental cleaning and x-rays',
          submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          processed_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('insurance_claim', null, {})
  },
}
