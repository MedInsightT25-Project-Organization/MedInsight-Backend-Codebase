const db = require('../db/models/index')
const Hospital = db.Hospital
const Service = db.Service
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} = require('../utils/errors')
const {
  validateHospital,
  validateHospitalUpdate,
} = require('../validators/hospitalValidator')

class HospitalController {
  // Create a new hospital
  async createHospital(req, res, next) {
    try {
      const { error } = validateHospital(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const hospitalData = {
        ...req.body,
        createdBy: req.user.id, // Set the creator as the current user
      }

      const hospital = await Hospital.create(hospitalData)
      res.status(201).json({
        status: 'success',
        data: hospital,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get all hospitals with optional filtering by local government
  async getHospitals(req, res, next) {
    try {
      const { localGovernment } = req.query
      const whereClause = localGovernment
        ? { localGovernmentArea: localGovernment }
        : {}

      const hospitals = await Hospital.findAll({
        where: whereClause,
        include: [
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'description', 'price'],
          },
        ],
      })

      res.status(200).json({
        status: 'success',
        results: hospitals.length,
        data: hospitals,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get a single hospital by ID
  async getHospitalById(req, res, next) {
    try {
      const hospital = await Hospital.findByPk(req.params.id, {
        include: [
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'description', 'price'],
          },
        ],
      })

      if (!hospital) {
        throw new NotFoundError('Hospital not found')
      }

      res.status(200).json({
        status: 'success',
        data: hospital,
      })
    } catch (error) {
      next(error)
    }
  }

  // Update a hospital
  async updateHospital(req, res, next) {
    try {
      const { error } = validateHospitalUpdate(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const hospital = await Hospital.findByPk(req.params.id)
      if (!hospital) {
        throw new NotFoundError('Hospital not found')
      }

      // Check if user is the hospital admin
      if (
        hospital.createdBy !== req.user.id &&
        req.user.role !== 'hospital_admin'
      ) {
        throw new AuthorizationError(
          'You are not authorized to update this hospital'
        )
      }

      await hospital.update(req.body)

      res.status(200).json({
        status: 'success',
        data: hospital,
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete a hospital
  async deleteHospital(req, res, next) {
    try {
      const hospital = await Hospital.findByPk(req.params.id)
      if (!hospital) {
        throw new NotFoundError('Hospital not found')
      }

      // Only super admin can delete hospitals
      if (req.user.role !== 'super_admin') {
        throw new AuthorizationError('Only super admin can delete hospitals')
      }

      await hospital.destroy()

      res.status(204).json({
        status: 'success',
        data: null,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = HospitalController
