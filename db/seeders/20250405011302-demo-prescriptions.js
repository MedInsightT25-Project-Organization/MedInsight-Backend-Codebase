'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { MedicalRecord, User } = queryInterface.sequelize.models

    // Get first medical record with diabetes diagnosis
    const diabetesRecord = await MedicalRecord.findOne({
      where: { diagnosis: 'Type 2 Diabetes Mellitus' },
    })

    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'practitioner' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'prescriptions',
      [
        {
          medication: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          instructions: 'Take with meals\nMonitor blood sugar levels',
          medical_record_id: diabetesRecord.id,
          practitioner_id: practitioners[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          medication: 'Empagliflozin',
          dosage: '10mg',
          frequency: 'Once daily',
          medical_record_id: diabetesRecord.id,
          practitioner_id: practitioners[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          medication: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          instructions: 'Take in the morning\nReport dizziness',
          medical_record_id: diabetesRecord.id,
          practitioner_id: practitioners[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('prescriptions', null, {})
  },
}
