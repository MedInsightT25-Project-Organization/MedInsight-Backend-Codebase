'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('practitioner_department', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      practitioner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'department',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add indexes with proper naming
    await queryInterface.addIndex(
      'practitioner_department',
      ['practitioner_id'],
      {
        name: 'practitioner_department_practitioner_id_idx',
      }
    )
    await queryInterface.addIndex(
      'practitioner_department',
      ['department_id'],
      {
        name: 'practitioner_department_department_id_idx',
      }
    )
    await queryInterface.addConstraint('practitioner_department', {
      fields: ['practitioner_id', 'department_id'],
      type: 'unique',
      name: 'practitioner_department_unique_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('practitioner_department')
  },
}
