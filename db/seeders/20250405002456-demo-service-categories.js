'use strict'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'service_categories',
      [
        {
          name: 'Consultation',
          description: 'Doctor consultations and checkups',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Diagnostics',
          description: 'Medical tests and scans',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Treatment',
          description: 'Therapeutic procedures',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Surgery',
          description: 'Surgical operations',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Pharmacy',
          description: 'Medication dispensing',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'service_categories',
      {
        name: {
          [Sequelize.Op.in]: [
            'Consultation',
            'Diagnostics',
            'Treatment',
            'Surgery',
            'Pharmacy',
          ],
        },
      },
      {}
    )
  },
}
