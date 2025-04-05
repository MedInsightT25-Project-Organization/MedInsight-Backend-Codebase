'use strict'
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: async (queryInterface) => {
    const { Insurance, Payment } = queryInterface.sequelize.models

    const insurance = await Insurance.findOne({
      where: { policy_number: 'HG-2023-001' },
    })

    const payment = await Payment.findOne({
      where: { payment_method: 'insurance' },
    })

    await queryInterface.bulkInsert(
      'insurance_claims',
      [
        {
          claim_amount: 200.0,
          status: 'approved',
          claim_number: `CLM-${uuidv4().substring(0, 8)}`,
          payment_id: payment.id,
          insurance_id: insurance.id,
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('insurance_claims', null, {})
  },
}
