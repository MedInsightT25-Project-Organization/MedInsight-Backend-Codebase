'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      review_type: {
        type: Sequelize.ENUM('practitioner', 'hospital', 'service'),
        allowNull: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      review: {
        type: Sequelize.TEXT,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      practitioner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hospitals',
          key: 'id',
        },
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'services',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    // Add check constraints
    await queryInterface.addConstraint('ratings', {
      fields: ['review_type'],
      type: 'check',
      name: 'rating_type_check',
      where: {
        [Sequelize.Op.or]: [
          {
            review_type: 'practitioner',
            practitioner_id: { [Sequelize.Op.not]: null },
          },
          {
            review_type: 'hospital',
            hospital_id: { [Sequelize.Op.not]: null },
          },
          {
            review_type: 'service',
            service_id: { [Sequelize.Op.not]: null },
          },
        ],
      },
    })

    await queryInterface.addIndex('ratings', ['patient_id'])
    await queryInterface.addIndex('ratings', ['practitioner_id'])
    await queryInterface.addIndex('ratings', ['hospital_id'])
    await queryInterface.addIndex('ratings', ['service_id'])
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ratings')
  },
}