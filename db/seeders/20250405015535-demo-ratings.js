'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { user, hospital, service } = queryInterface.sequelize.models

    // Get patients
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'patient' LIMIT 2"
    )

    // Get practitioners
    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'practitioner' LIMIT 2"
    )

    // Get hospitals
    const hospitals = await hospital.findAll({ limit: 2 })

    // Get services
    const services = await service.findAll({ limit: 2 })

    await queryInterface.bulkInsert(
      'ratings',
      [
        // Practitioner rating
        {
          review_type: 'practitioner',
          rating: 5,
          review: 'Excellent bedside manner',
          patient_id: patients[0].id,
          practitioner_id: practitioners[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Hospital rating
        {
          review_type: 'hospital',
          rating: 4,
          review: 'Clean facilities, friendly staff',
          patient_id: patients[1].id,
          hospital_id: hospitals[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Service rating
        {
          review_type: 'service',
          rating: 3,
          patient_id: patients[0].id,
          service_id: services[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('ratings', null, {})
  },
}
