const fs = require('fs/promises')
const db = require('../db/models/index')
const Message = db.Message
const Appointment = db.Appointment
const User = db.User
const Hospital = db.Hospital
const Service = db.Service
const Notification = db.Notification

const {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  ConflictError,
} = require('../utils/errors')
const { logger } = require('../utils/logger')
const cloudinary = require('../config/cloudinary')
const {
  validateHospital,
  validateHospitalUpdate,
} = require('../validators/hospitalValidator')



class HospitalController {
  // Create a new hospital
  async createHospital(req, res, next) {
    try {
      const id = req.user.id

      // Check if hospital exists
      const user = await User.findOne({ where: { id } })

      if (!user) {
        return next(new NotFoundError('User not found'))
      }
      // Check if profile is already completed
      if (user.hasCompletedProfile) {
        return next(
          new ConflictError('User has already completed their profile')
        )
      }

      const data = req.body
      const { error } = validateHospital(data)
      if (error) {
        return next(new ValidationError(error.details[0].message))
      }
      data.createdBy = id // Ensure the key matches your database model
      const transaction = await Hospital.sequelize.transaction()

      try {
        const hospital = await Hospital.create(data, { transaction })

        // Update user's profile completion status
        const [affectedRows] = await User.update(
          { hasCompletedProfile: true },
          { where: { id }, paranoid: false, transaction }
        )
        if (affectedRows === 0) {
          console.warn(`No rows updated. User with ID ${id} may not exist.`)
        } else {
          console.log(`User profile completion status updated for ID ${id}`)
        }

        await transaction.commit()

        res.status(201).json({
          status: 'success',
          message: 'Hospital created successfully',
          data: hospital,
        })
      } catch (error) {
        await transaction.rollback()
        return next(error)
      }
    } catch (error) {
      next(error)
    }
  }

  async updateHospital(req, res, next) {
    const transaction = await Hospital.sequelize.transaction()
    try {
      const userId = req.user.id
      const data = req.body

      // Validate incoming data
      const { error } = validateHospitalUpdate(data)
      if (error) {
        throw next(new ValidationError(error.details[0].message))
      }

      // Get the user's profile
      const hospital = await Hospital.findOne({
        where: { created_by: userId },
        transaction,
      })

      if (!hospital) {
        return next(new NotFoundError('Hospital not found.'))
      }

      // Update the hospital details
      await hospital.update(data, { transaction })

      // Optionally update hasCompletedProfile if it's still false
      const user = await User.findByPk(userId, { transaction })
      if (user && !user.hasCompletedProfile) {
        await user.update({ hasCompletedProfile: true }, { transaction })
      }

      await transaction.commit()

      logger.info(`Hospital Details updated for user: ${userId}`)
      res.json({
        status: 'success',
        message: 'Hospital details updated successfully',
      })
    } catch (error) {
      await transaction.rollback()
      logger.error('Update hospital detail error:', error)
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
          {
            model: User,
            as: 'hospitalAdmin',
            attributes: ['id', 'role', 'email'],
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: ['id', 'scheduledTime', 'patientId','hospitalId', 'status'],
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
          {
            model: User,
            as: 'hospitalAdmin',
            attributes: ['id', 'role', 'email'],
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: ['id', 'scheduledTime', 'patientId','hospitalId', 'status'],
          },
        ],
        attributes: {
          exclude: ['created_at' ,'updated_at', 'deleted_at'],
        },
      })

      if (!hospital) {
        return next (new NotFoundError('Hospital not found'))
      }

      res.status(200).json({
        status: 'success',
        data: hospital,
      })
    } catch (error) {
      next(error)
    }
  }

  async getHospitalProfile(req, res, next) {
    const userId = req.user.id
    console.log('Hospital ID:', userId)
    try {

      const user = await User.findByPk(userId)
      if (!user) {
        return next (new NotFoundError('User not found'))
      }
      const createdBy = user.id
      
      const hospital = await Hospital.findOne({where : { createdBy: createdBy }})
      if (!hospital) {
        return next (new NotFoundError('Hospital not found'))
      } 

      const hospitalProfile = await Hospital.findByPk(hospital.id, {
        include: [
          {
            model: Service,
            as: 'services',
            attributes: ['id', 'name', 'description', 'price'],
          },
          {
            model: User,
            as: 'hospitalAdmin',
            attributes: ['id', 'role', 'email'],
          },
          {
            model: Appointment,
            as: 'appointments',
            attributes: ['id', 'scheduledTime', 'patientId','hospitalId', 'status'],
          },
        ],
      })

      if (!hospital) {
        return next (new NotFoundError('Hospital not found'))
      }

      res.status(200).json({
        status: 'success',
        data: hospitalProfile,
      })
    } catch (error) {
      next(error)
    }
  }

  async uploadHospitalPicture(req, res, next) {
    try {
      const userId = req.user.id

      if (!req.file) {
        throw next(new ValidationError('No file uploaded'))
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
        use_filename: true,
      })

      // Delete local file after successful upload
      await fs.unlink(req.file.path)

      // Update user profile with new picture URL
      const hospital = await Hospital.findOne({
        where: { created_by: userId },
      })

      if (!hospital) {
        return next (new ValidationError('User profile not found'))
      }

      await hospital.update({
        hospitalPicture: result.secure_url,
      })

      logger.info(`Profile picture updated for user: ${userId}`)

      res.json({
        status: 'success',
        message: 'Profile picture updated successfully',
        data: {
          url: result.secure_url,
        },
      })
    } catch (error) {
      logger.error('Upload hospital picture error:', error)
      next(error)
    }
  }

  // Mark notification as read
  async markNotificationAsRead(req, res, next) {
    try {
      const userId = req.user.id
      const notificationId = req.params.id

      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          user_id: userId,
        },
      })

      if (!notification) {
        return next (new ValidationError('Notification not found'))
      }

      await notification.update({
        is_read: true,
      })

      logger.info(
        `Notification ${notificationId} marked as read for user: ${userId}`
      )

      res.json({
        status: 'success',
        message: 'Notification marked as read',
      })
    } catch (error) {
      logger.error('Mark notification as read error:', error)
      next(error)
    }
  }

  // Delete a hospital
  async deleteHospitalById(req, res, next) {
    try {
      const hospital = await Hospital.findByPk(req.params.id)
      if (!hospital) {
        return next (new NotFoundError('Hospital not found'))
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
