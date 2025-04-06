'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { User, Conversation } = queryInterface.sequelize.models

    // Get a patient and a practitioner
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'patient' LIMIT 1"
    )
    const [practitioners] = await queryInterface.sequelize.query(
      "SELECT id FROM user WHERE role = 'practitioner' LIMIT 1"
    )

    // Get a conversation
    const conversation = await Conversation.findOne()

    await queryInterface.bulkInsert(
      'message',
      [
        {
          conversation_id: conversation.id,
          sender_id: patients[0].id,
          content: 'Hello, I have a question about my recent appointment.',
          status: 'sent',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          conversation_id: conversation.id,
          sender_id: practitioners[0].id,
          content: 'Of course! How can I help you?',
          status: 'sent',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          conversation_id: conversation.id,
          sender_id: patients[0].id,
          content: 'When will my test results be available?',
          status: 'sent',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('message', null, {})
  },
}
