'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { MedicalRecord, User, Appointment } = queryInterface.sequelize.models

    // Get diabetes medical record
    const diabetesRecord = await MedicalRecord.findOne({
      where: { diagnosis: 'Type 2 Diabetes Mellitus' },
    })

    // Get practitioners
    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'practitioner' LIMIT 2"
    )

    // Get blood test appointment
    const bloodTestAppointment = await Appointment.findOne({
      where: { type: 'test' },
    })

    await queryInterface.bulkInsert(
      'test_results',
      [
        {
          test_type: 'blood_test',
          result_data: JSON.stringify({
            hba1c: '7.8%',
            glucose: '145 mg/dL',
            cholesterol: '210 mg/dL',
          }),
          status: 'completed',
          test_date: new Date('2024-03-15'),
          medical_record_id: diabetesRecord.id,
          practitioner_id: practitioners[0].id,
          appointment_id: bloodTestAppointment.id,
          file_url: '/reports/blood-test-123.pdf',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          test_type: 'ecg',
          result_data: JSON.stringify({
            heart_rate: '72 bpm',
            rhythm: 'normal sinus',
            intervals: 'PR: 120ms, QRS: 90ms',
          }),
          status: 'completed',
          test_date: new Date('2024-03-20'),
          medical_record_id: diabetesRecord.id,
          practitioner_id: practitioners[1].id,
          file_url: '/reports/ecg-456.pdf',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          test_type: 'urinalysis',
          result_data: JSON.stringify({
            glucose: 'negative',
            protein: 'trace',
            ketones: 'negative',
          }),
          status: 'completed',
          test_date: new Date('2024-03-18'),
          medical_record_id: diabetesRecord.id,
          practitioner_id: practitioners[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('test_results', null, {})
  },
}