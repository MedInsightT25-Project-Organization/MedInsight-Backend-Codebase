'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { Conversation, User } = queryInterface.sequelize.models

    const [directConvo] = await Conversation.findAll({
      where: { type: 'direct' },
    })
    const [patient, practitioner] = await User.findAll({
      where: { role: ['patient', 'practitioner'] },
      limit: 2,
    })

    await queryInterface.bulkInsert(
      'messages',
      [
        {
          content: 'Hi Doctor, I have a question about my prescription',
          conversation_id: directConvo.id,
          sender_id: patient.id,
          status: 'read',
        },
        {
          content: 'Sure, what would you like to know?',
          conversation_id: directConvo.id,
          sender_id: practitioner.id,
          status: 'delivered',
        },
      ],
      {}
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('messages', null, {})
  },
}
