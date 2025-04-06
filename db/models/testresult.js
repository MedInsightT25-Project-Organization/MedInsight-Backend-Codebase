const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

const TestResult = sequelize.define(
  'TestResult',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    testType: {
      type: DataTypes.ENUM(
        'blood_test',
        'mri',
        'x_ray',
        'urinalysis',
        'biopsy',
        'ecg'
      ),
      field: 'test_type',
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    resultData: {
      type: DataTypes.TEXT,
      field: 'result_data',
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'abnormal'),
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'completed', 'abnormal']],
      },
    },
    testDate: {
      type: DataTypes.DATE,
      field: 'test_date',
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    fileUrl: {
      type: DataTypes.STRING,
      field: 'file_url',
      validate: {
        isUrl: true,
      },
    },
    medicalRecordId: {
      type: DataTypes.INTEGER,
      field: 'medical_record_id',
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    practitionerId: {
      type: DataTypes.INTEGER,
      field: 'practitioner_id',
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      field: 'appointment_id',
      validate: {
        isInt: true,
      },
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
    tableName: 'test_result',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    paranoid: true,
  }
)

TestResult.associate = (models) => {
  TestResult.belongsTo(models.MedicalRecord, {
    foreignKey: 'medical_record_id',
    as: 'MedicalRecord',
  })

  TestResult.belongsTo(models.User, {
    foreignKey: 'practitioner_id',
    as: 'Practitioner',
  })

  TestResult.belongsTo(models.Appointment, {
    foreignKey: 'appointment_id',
    as: 'Appointment',
  })
}

module.exports = TestResult
