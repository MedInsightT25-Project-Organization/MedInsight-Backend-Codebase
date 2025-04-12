'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { Conversation, User } = queryInterface.sequelize.models

    const [directConvo, groupConvo] = await Conversation.findAll()
    const [patient1, patient2, practitioner] = await User.findAll({
      where: { role: ['patient', 'practitioner'] },
      limit: 3,
    })

    await queryInterface.bulkInsert(
      'participants',
      [
        // Direct conversation
        {
          conversation_id: directConvo.id,
          user_id: patient1.id,
          role: 'admin',
        },
        {
          conversation_id: directConvo.id,
          user_id: practitioner.id,
        },
        // Group conversation
        {
          conversation_id: groupConvo.id,
          user_id: patient1.id,
          role: 'admin',
        },
        {
          conversation_id: groupConvo.id,
          user_id: patient2.id,
        },
        {
          conversation_id: groupConvo.id,
          user_id: practitioner.id,
        },
      ],
      {}
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('participants', null, {})
  },
}