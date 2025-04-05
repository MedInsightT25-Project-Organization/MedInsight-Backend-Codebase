'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { Message } = queryInterface.sequelize.models
    const message = await Message.findOne({
      where: { content: 'Hi Doctor, I have a question about my prescription' },
    })

    await queryInterface.bulkInsert(
      'attachments',
      [
        {
          file_url: '/uploads/prescription.pdf',
          file_type: 'pdf',
          file_name: 'prescription.pdf',
          message_id: message.id,
        },
        {
          file_url: '/uploads/lab-report.jpg',
          file_type: 'image',
          file_name: 'lab-report.jpg',
          message_id: message.id,
        },
      ],
      {}
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('attachments', null, {})
  },
}
