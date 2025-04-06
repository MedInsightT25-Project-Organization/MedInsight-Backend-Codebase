'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [hospitals] = await queryInterface.sequelize.query(
      "SELECT id FROM hospitals WHERE name IN ('City General Hospital', 'Westside Medical Center')"
    )

    const [categories] = await queryInterface.sequelize.query(
      "SELECT id, name FROM service_categories WHERE name IN ('Consultation', 'Diagnostics', 'Treatment')"
    )

    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat.id
      return acc
    }, {})

    await queryInterface.bulkInsert(
      'services',
      [
        // City General Hospital Services
        {
          name: 'General Consultation',
          description: 'Basic doctor consultation',
          cost: 100.0,
          duration: 30,
          hospital_id: hospitals[0].id,
          category_id: categoryMap['Consultation'],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'MRI Scan',
          description: 'Full body MRI scan',
          cost: 500.0,
          duration: 60,
          hospital_id: hospitals[0].id,
          category_id: categoryMap['Diagnostics'],
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Westside Medical Center Services
        {
          name: 'Blood Test Package',
          description: 'Complete blood work analysis',
          cost: 75.0,
          duration: 15,
          hospital_id: hospitals[1].id,
          category_id: categoryMap['Diagnostics'],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Physical Therapy Session',
          description: '60-minute physiotherapy session',
          cost: 120.0,
          duration: 60,
          hospital_id: hospitals[1].id,
          category_id: categoryMap['Treatment'],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('services', null, {})
  },
}
