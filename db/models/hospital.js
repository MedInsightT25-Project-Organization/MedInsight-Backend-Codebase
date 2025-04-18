const { DataTypes } = require('sequelize')
const {sequelize} = require('../../config/database')

const Hospital = sequelize.define(
  'hospital',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactEmail: {
      type: DataTypes.STRING,
      field: 'contact_email',
      validate: {
        isEmail: true,
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    localGovernmentArea: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceSummary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    workHours: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'created_by',
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE, 
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },  
  },
  {
    tableName: 'hospitals',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
  }
)

// Relationships
Hospital.associate = (models) => {
  // Hospital belongs to a User (hospital_admin)
  Hospital.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'admin',
  })

  // Hospital has many Services/Appointments (define later)
  Hospital.hasMany(models.Service, { foreignKey: 'hospital_id' })
  Hospital.hasMany(models.Appointment, { foreignKey: 'hospital_id' })
}

module.exports = Hospital