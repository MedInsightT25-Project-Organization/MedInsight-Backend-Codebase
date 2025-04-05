'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'allergies',
      [
        {
          allergen: 'Penicillin',
          severity: 'severe',
          reaction: 'Anaphylaxis',
          notes: 'Reported in 2018',
          user_id: patients[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          allergen: 'Peanuts',
          severity: 'moderate',
          reaction: 'Hives, swelling',
          user_id: patients[1].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          allergen: 'Dust Mites',
          severity: 'mild',
          reaction: 'Sneezing, congestion',
          user_id: patients[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('allergies', null, {})
  },
}