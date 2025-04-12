'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { User } = queryInterface.sequelize.models

    // Get a patient
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'patient' LIMIT 1"
    )

    await queryInterface.bulkInsert(
      'health_metric',
      [
        {
          patient_id: patients[0].id,
          metric_type: 'blood_pressure',
          value: '120/80',
          unit: 'mmHg',
          recorded_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          patient_id: patients[0].id,
          metric_type: 'heart_rate',
          value: '72',
          unit: 'bpm',
          recorded_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          patient_id: patients[0].id,
          metric_type: 'weight',
          value: '70',
          unit: 'kg',
          recorded_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('health_metric', null, {})
  },
}
