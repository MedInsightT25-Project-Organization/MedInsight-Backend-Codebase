'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rating', {
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
          model: 'user',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      practitioner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hospital',
          key: 'id',
        },
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'service',
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    })

    // Add check constraints
    await queryInterface.addConstraint('rating', {
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

    await queryInterface.addIndex('rating', ['patient_id'], {
      name: 'rating_patient_id_idx',
    })
    await queryInterface.addIndex('rating', ['practitioner_id'], {
      name: 'rating_practitioner_id_idx',
    })
    await queryInterface.addIndex('rating', ['hospital_id'], {
      name: 'rating_hospital_id_idx',
    })
    await queryInterface.addIndex('rating', ['service_id'], {
      name: 'rating_service_id_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('rating')
  },
}
