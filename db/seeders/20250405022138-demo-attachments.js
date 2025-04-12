'use strict'

module.exports = {
  up: async (queryInterface) => {
    const { Message } = queryInterface.sequelize.models

    // Get a message
    const message = await Message.findOne()

    await queryInterface.bulkInsert(
      'attachment',
      [
        {
          message_id: message.id,
          file_url: 'https://storage.example.com/prescriptions/rx-2024-001.pdf',
          file_type: 'application/pdf',
          file_name: 'prescription.pdf',
          file_size: 1024,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          message_id: message.id,
          file_url: 'https://storage.example.com/lab-results/lab-2024-001.pdf',
          file_type: 'application/pdf',
          file_name: 'lab-results.pdf',
          file_size: 2048,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('attachment', null, {})
  },
}
