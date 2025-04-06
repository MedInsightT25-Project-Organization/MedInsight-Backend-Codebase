'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hospital',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'service_category',
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

    await queryInterface.addIndex('service', ['hospital_id'], {
      name: 'service_hospital_id_idx',
    })
    await queryInterface.addIndex('service', ['category_id'], {
      name: 'service_category_id_idx',
    })
    await queryInterface.addIndex('service', ['name'], {
      name: 'service_name_idx',
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('service')
  },
}
