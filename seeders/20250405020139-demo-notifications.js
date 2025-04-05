'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [patients, practitioners] = await Promise.all([
      queryInterface.sequelize.query(
        "SELECT id FROM users WHERE role = 'patient' LIMIT 2",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        "SELECT id FROM users WHERE role = 'practitioner' LIMIT 1",
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
    ])

    const [appointments] = await queryInterface.sequelize.query(
      'SELECT id FROM appointments LIMIT 1'
    )

    await queryInterface.bulkInsert(
      'notifications',
      [
        // Patient notifications
        {
          message:
            'Your appointment with Dr. Smith is confirmed for tomorrow at 2 PM',
          type: 'appointment',
          status: 'unread',
          reference_id: appointments[0].id,
          user_id: patients[0].id,
        },
        {
          message: 'Payment of $150 for Appointment #123 was successful',
          type: 'payment',
          status: 'read',
          user_id: patients[0].id,
        },
        // Practitioner notification
        {
          message: 'New appointment request from John Doe',
          type: 'appointment',
          status: 'unread',
          user_id: practitioners[0].id,
        },
        // System-wide notification
        {
          message: 'System maintenance scheduled tonight at 11 PM',
          type: 'system',
          status: 'unread',
          user_id: patients[0].id,
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('notifications', null, {})
  },
}
