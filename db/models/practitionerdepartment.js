const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const PractitionerDepartment = sequelize.define(
  'PractitionerDepartment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      field: 'practitioner_id',
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      field: 'department_id',
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'practitioner_department',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

PractitionerDepartment.associate = (models) => {
  PractitionerDepartment.belongsTo(models.User, {
    foreignKey: 'practitioner_id',
    as: 'Practitioner',
  })

  PractitionerDepartment.belongsTo(models.Department, {
    foreignKey: 'department_id',
    as: 'Department',
  })
}

module.exports = PractitionerDepartment
