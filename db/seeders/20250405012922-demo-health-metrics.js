'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'health_metrics',
      [
        {
          metric_type: 'blood_pressure',
          value: 120.8,
          unit: 'mmHg',
          recorded_at: new Date('2024-03-01'),
          user_id: patients[0].id,
        },
        {
          metric_type: 'weight',
          value: 75.5,
          unit: 'kg',
          recorded_at: new Date('2024-03-05'),
          user_id: patients[0].id,
        },
        {
          metric_type: 'blood_glucose',
          value: 5.4,
          unit: 'mmol/L',
          recorded_at: new Date('2024-03-10'),
          user_id: patients[1].id,
        },
        {
          metric_type: 'heart_rate',
          value: 72,
          unit: 'bpm',
          recorded_at: new Date('2024-03-15'),
          user_id: patients[0].id,
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('health_metrics', null, {})
  },
}
