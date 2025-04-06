'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'practitioner' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'medical_records',
      [
        {
          diagnosis: 'Type 2 Diabetes Mellitus',
          prescription:
            'Metformin 500mg twice daily\nRegular blood sugar monitoring',
          test_results: 'HbA1c: 7.8%\nFasting Glucose: 145 mg/dL',
          patient_id: patients[0].id,
          practitioner_id: practitioners[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          diagnosis: 'Hypertension Stage 1',
          prescription: 'Lisinopril 10mg daily\nReduce sodium intake',
          test_results: 'BP: 145/92 mmHg\nCholesterol: 210 mg/dL',
          patient_id: patients[1].id,
          practitioner_id: practitioners[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          diagnosis: 'Seasonal Allergies',
          prescription: 'Loratadine 10mg daily\nNasal saline irrigation',
          patient_id: patients[0].id,
          practitioner_id: practitioners[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('medical_records', null, {})
  },
}
