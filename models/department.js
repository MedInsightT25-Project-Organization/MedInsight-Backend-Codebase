const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      field: 'hospital_id',
      allowNull: false,
    },
    headPractitionerId: {
      type: DataTypes.INTEGER,
      field: 'head_practitioner_id',
      allowNull: true,
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
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    underscored: true,
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
)

Department.associate = (models) => {
  Department.belongsTo(models.Hospital, {
    foreignKey: 'hospital_id',
    as: 'Hospital',
  })

  Department.belongsTo(models.User, {
    foreignKey: 'head_practitioner_id',
    as: 'HeadPractitioner',
  })

  Department.hasMany(models.PractitionerDepartment, {
    foreignKey: 'department_id',
  })
}

module.exports = Department
