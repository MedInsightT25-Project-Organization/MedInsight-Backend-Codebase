'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'practitioner' LIMIT 2"
    )

    const [hospitals] = await queryInterface.sequelize.query(
      'SELECT id FROM hospitals LIMIT 2'
    )

    await queryInterface.bulkInsert(
      'appointments',
      [
        {
          appointment_date: new Date(Date.now() + 86400000), // Tomorrow
          type: 'consultation',
          status: 'confirmed',
          patient_id: patients[0].id,
          practitioner_id: practitioners[0].id,
          hospital_id: hospitals[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          appointment_date: new Date(Date.now() + 172800000), // 2 days later
          type: 'test',
          status: 'pending',
          patient_id: patients[1].id,
          practitioner_id: practitioners[1].id,
          hospital_id: hospitals[1].id,
          notes: 'Fasting required before blood test',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          appointment_date: new Date(Date.now() - 86400000), // Yesterday
          type: 'follow-up',
          status: 'completed',
          patient_id: patients[0].id,
          practitioner_id: practitioners[0].id,
          hospital_id: hospitals[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('appointments', null, {})
  },
}
