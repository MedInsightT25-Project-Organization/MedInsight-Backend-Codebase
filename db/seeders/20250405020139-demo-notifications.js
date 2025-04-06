'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { User } = queryInterface.sequelize.models

    // Get a patient and a practitioner
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'patient' LIMIT 1"
    )
    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'practitioner' LIMIT 1"
    )

    await queryInterface.bulkInsert(
      'notification',
      [
        {
          user_id: patients[0].id,
          type: 'appointment',
          message:
            'Your appointment has been confirmed for tomorrow at 10:00 AM',
          status: 'unread',
          reference_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: patients[0].id,
          type: 'payment',
          message: 'Your payment of $150 has been processed successfully',
          status: 'read',
          reference_id: 2,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          user_id: practitioners[0].id,
          type: 'appointment',
          message: 'New appointment request from John Doe',
          status: 'unread',
          reference_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: practitioners[0].id,
          type: 'system',
          message: 'Your profile has been verified',
          status: 'read',
          reference_id: 4,
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 48 * 60 * 60 * 1000),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('notification', null, {})
  },
}
