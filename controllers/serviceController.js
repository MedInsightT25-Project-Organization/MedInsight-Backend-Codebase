const { attempt } = require('joi')
const db = require('../db/models/index')
const Service = db.Service
const Hospital = db.Hospital
const User = db.User
const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} = require('../utils/errors')
const { logger } = require('../utils/logger')
const { validateHospitalService } = require('../validators/hospitalValidator')

class ServiceController {
  // Add a new service to a hospital
  async createHospitalServices(req, res, next) {
    try {
      // Validate request body
      const data = req.body
      const { error } = validateHospitalService(data)
      if (error) {
        return next(new ValidationError(error.details[0].message))
      }
      const hospitalId = req.params.hospitalId

      // Get the hospital by ID and include the hospital admin
      const hospital = await Hospital.findByPk(hospitalId, {
        include: [
          {
            model: User,
            as: 'hospitalAdmin',
            attributes: ['id', 'role', 'email'],
          },
        ],
      })

      if (!hospital) {
        return next(new NotFoundError('Hospital not found'))
      }

      // Check if user is the hospital admin
      if (hospital.createdBy !== req.user.id) {
        throw new AuthorizationError(
          'You are not authorized to add services to this hospital'
        )
      }

      const serviceData = {
        ...data,
        hospitalId: hospital.id,
      }

      const service = await Service.create(serviceData)
      logger.info(
        `Service created successfully for hospital ID: ${hospital.id}`
      )

      res.status(201).json({
        status: 'success',
        message: 'Service created successfully',
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
        include: [
          {
            model: Hospital,
            as: 'hospital',
            attributes: ['id', 'name', 'address'],
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
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

  // Get a single service by ID

  async getHospitalServicesById(req, res, next) {
   try {
    const { hospitalId, serviceId } = req.params
     const hospital = await Hospital.findByPk(hospitalId)
     if (!hospital) {
       throw new NotFoundError('Hospital not found')
     }

     const service = await Service.findOne({
       where: { hospitalId: hospital.id,
          id: serviceId },
       include: [
          {
            model: Hospital,
            as: 'hospital',
            attributes: ['id', 'name', 'address'],
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
     })

     res.status(200).json({
       status: 'success',
       message: 'Service retrieved successfully',
       data: service,
     })
   } catch (error) {
     next(error)
   }
  }

  // Update a service
  async updateHospitalServicesById(req, res, next) {
    try {
      // Validate request body
      const data = req.body
      const { error } = validateHospitalService(data)
      if (error) {
        return next(new ValidationError(error.details[0].message))
      }
      const { hospitalId, serviceId } = req.params
      const hospital = await Hospital.findByPk(hospitalId, {
        include: [
          {
            model: User,
            as: 'hospitalAdmin',
            attributes: ['id', 'role', 'email'],
          },
        ],
      })
      if (!hospital) {
        return next(new NotFoundError('Hospital not found'))
      }
      const service = await Service.findByPk(serviceId, {
        where: { hospitalId: hospital.id },
        include: [
          {
            model: Hospital,
            as: 'hospital',
            attributes: ['id', 'name', 'address', 'createdBy'],
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

      await service.update(data)
      logger.info(
        `Service updated successfully for hospital ID: ${hospital.id}`
      )

      res.status(200).json({
        status: 'success',
        message: 'Service updated successfully',
        data: service,
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete a service
  async deleteService(req, res, next) {
    try {
      const { hospitalId, serviceId } = req.params
      const service = await Service.findByPk(serviceId, {
        where: { hospitalId: hospitalId },
        include: [
          {
            model: Hospital,
            as: 'hospital',
            attributes: ['id', 'name', 'address', 'createdBy'],
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
      logger.info(
        `Service deleted successfully for hospital ID: ${service.hospital.id}`
      )

      res.status(204).json({
        status: 'success',
        message: 'Service deleted successfully',
        data: null,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ServiceController
