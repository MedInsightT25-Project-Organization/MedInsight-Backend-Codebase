const Service = require('../db/models/service')
const Hospital = require('../db/models/hospital')
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} = require('../utils/errors')

class ServiceController {
  // Add a new service to a hospital
  async createService(req, res, next) {
    try {
      const hospital = await Hospital.findByPk(req.params.hospitalId)
      if (!hospital) {
        throw new NotFoundError('Hospital not found')
      }

      // Check if user is the hospital admin
      if (hospital.createdBy !== req.user.id) {
        throw new AuthorizationError(
          'You are not authorized to add services to this hospital'
        )
      }

      const serviceData = {
        ...req.body,
        hospitalId: hospital.id,
      }

      const service = await Service.create(serviceData)

      res.status(201).json({
        status: 'success',
        data: service,
      })
    } catch (error) {
      next(error)
    }
  }

  // Get all services for a hospital
  async getHospitalServices(req, res, next) {
    try {
      const hospital = await Hospital.findByPk(req.params.hospitalId)
      if (!hospital) {
        throw new NotFoundError('Hospital not found')
      }

      const services = await Service.findAll({
        where: { hospitalId: hospital.id },
      })

      res.status(200).json({
        status: 'success',
        results: services.length,
        data: services,
      })
    } catch (error) {
      next(error)
    }
  }

  // Update a service
  async updateService(req, res, next) {
    try {
      const service = await Service.findByPk(req.params.id, {
        include: [
          {
            model: Hospital,
            as: 'hospital',
          },
        ],
      })

      if (!service) {
        throw new NotFoundError('Service not found')
      }

      // Check if user is the hospital admin
      if (service.hospital.createdBy !== req.user.id) {
        throw new AuthorizationError(
          'You are not authorized to update this service'
        )
      }

      await service.update(req.body)

      res.status(200).json({
        status: 'success',
        data: service,
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete a service
  async deleteService(req, res, next) {
    try {
      const service = await Service.findByPk(req.params.id, {
        include: [
          {
            model: Hospital,
            as: 'hospital',
          },
        ],
      })

      if (!service) {
        throw new NotFoundError('Service not found')
      }

      // Check if user is the hospital admin
      if (service.hospital.createdBy !== req.user.id) {
        throw new AuthorizationError(
          'You are not authorized to delete this service'
        )
      }

      await service.destroy()

      res.status(204).json({
        status: 'success',
        data: null,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ServiceController
