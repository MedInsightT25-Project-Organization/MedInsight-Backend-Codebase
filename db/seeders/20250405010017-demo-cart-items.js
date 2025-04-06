'use strict'

module.exports = {
  up: async (queryInterface) => {
    const [carts] = await queryInterface.sequelize.query(
      'SELECT id FROM carts ORDER BY created_at DESC LIMIT 2'
    )

    const { Service, Hospital } = queryInterface.sequelize.models

    const consultation = await Service.findOne({
      where: { name: 'General Consultation' },
    })
    const mri = await Service.findOne({ where: { name: 'MRI Scan' } })
    const bloodTest = await Service.findOne({
      where: { name: 'Blood Test Package' },
    })

    const [hospitals] = await queryInterface.sequelize.query(
      'SELECT id FROM hospitals LIMIT 2'
    )

    await queryInterface.bulkInsert(
      'cart_items',
      [
        // Cart 1 Items
        {
          cart_id: carts[0].id,
          service_id: consultation.id,
          hospital_id: hospitals[0].id,
          quantity: 1,
          scheduled_date: new Date(Date.now() + 86400000), // Tomorrow
        },
        {
          cart_id: carts[0].id,
          service_id: mri.id,
          hospital_id: hospitals[0].id,
          quantity: 1,
          scheduled_date: new Date(Date.now() + 86400000),
        },
        // Cart 2 Items
        {
          cart_id: carts[1].id,
          service_id: bloodTest.id,
          hospital_id: hospitals[1].id,
          quantity: 2,
          scheduled_date: new Date(Date.now() + 172800000), // 2 days later
        },
      ],
      {}
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('cart_items', null, {})
  },
}
