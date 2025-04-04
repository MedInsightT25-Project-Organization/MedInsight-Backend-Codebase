'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('appointment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER
      },
      practitioner_id: {
        type: Sequelize.INTEGER
      },
      hospital_id: {
        type: Sequelize.INTEGER
      },
      appointment_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      is_verified: {
        type: Sequelize.BOOLEAN
      },  
      is_featured: {
        type: Sequelize.BOOLEAN
      },
      is_approved: {
        type: Sequelize.BOOLEAN
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      },
      is_blocked: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('appointment');
  }
};