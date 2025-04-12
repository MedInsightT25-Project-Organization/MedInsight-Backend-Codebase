'use strict'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: async (queryInterface) => {
    const [patients] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'patient' LIMIT 2"
    )

    const [appointments] = await queryInterface.sequelize.query(
      "SELECT id FROM appointments WHERE status = 'completed' LIMIT 2"
    )

    await queryInterface.bulkInsert(
      'payments',
      [
        {
          amount: 150.0,
          payment_method: 'credit_card',
          status: 'completed',
          transaction_id: uuidv4(),
          patient_id: patients[0].id,
          appointment_id: appointments[0].id,
        },
        {
          amount: 75.5,
          payment_method: 'upi',
          status: 'completed',
          transaction_id: uuidv4(),
          patient_id: patients[1].id,
          appointment_id: appointments[1].id,
        },
        {
          amount: 200.0,
          payment_method: 'insurance',
          status: 'pending',
          transaction_id: uuidv4(),
          patient_id: patients[0].id,
          appointment_id: appointments[0].id,
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('payments', null, {})
  },
}
