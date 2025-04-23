const fs = require('fs/promises')
const db = require('../db/models/index')
const User = db.User
const UserProfile = db.UserProfile
const UserPreference = db.UserPreference
const PatientVitals = db.PatientVitals
const Notification = db.Notification
const { logger } = require('../utils/logger')
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require('../utils/errors')
const cloudinary = require('../config/cloudinary')
const {
  validateUserProfile,
  validateUserPreference,
  validatePatientVital,
} = require('../validators/userValidator')


class UserController {
  // Get user profile
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id // Get the user ID from the request

      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserProfile,
            as: 'userProfile',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id'],
            },
          },
          {
            model: UserPreference,
            as: 'userPreference',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id'],
            },
          },
          {
            model: PatientVitals,
            as: 'vitals',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id'],
            },
          },
        ],
        attributes: {
          exclude: ['password_hash', 'created_at', 'updated_at', 'deleted_at'],
        },
      })

      if (!user) {
        throw new ValidationError('User not found')
      }

      logger.info(`Profile retrieved for user: ${userId}`)

      res.json({
        status: 'success',
        data: {
          user,
        },
      })
    } catch (error) {
      logger.error('Get profile error:', error)
      next(error)
    }
  }

  // Get user profile by ID
  async getProfileById(req, res, next) {
    try {
      const userId =  req.params.id // Get the user ID from the request

      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserProfile,
            as: 'userProfile',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id'],
            },
          },
          {
            model: UserPreference,
            as: 'userPreference',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id'],
            },
          },
          {
            model: PatientVitals,
            as: 'vitals',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id'],
            },
          },
        ],
        attributes: {
          exclude: ['password_hash', 'created_at', 'updated_at', 'deleted_at'],
        },
      })

      if (!user) {
        throw new ValidationError('User not found')
      }

      logger.info(`Profile retrieved for user: ${userId}`)

      res.json({
        status: 'success',
        data: {
          user,
        },
      })
    } catch (error) {
      logger.error('Get profile error:', error)
      next(error)
    }
  }

  // Create user profile
  async createProfile(req, res, next) {
    try {
      const id = req.user.id

      // Check if user exists
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
      const { error } = validateUserProfile(data)

      if (error) {
        return next(new ValidationError(error.details[0].message))
      }

      data.userId = id // Ensure the key matches your database model

      const transaction = await User.sequelize.transaction()

      try {
        const userProfile = await UserProfile.create(data, { transaction })

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

        return res.status(201).json({
          status: 'success',
          message: 'Profile created successfully',
          data: userProfile,
        })
      } catch (error) {
        await transaction.rollback()
        return next(error)
      }
    } catch (error) {
      return next(error)
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    const transaction = await User.sequelize.transaction()
    try {
      const userId = req.user.id
      const data = req.body

      // Validate incoming data
      const { error } = validateUserProfile(data)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      // Get the user's profile
      const userProfile = await UserProfile.findOne({
        where: { user_id: userId },
        transaction,
      })

      if (!userProfile) {
        throw new NotFoundError('User profile not found.')
      }

      // Update the profile
      await userProfile.update(data, { transaction })

      // Optionally update hasCompletedProfile if it's still false
      const user = await User.findByPk(userId, { transaction })
      if (user && !user.hasCompletedProfile) {
        await user.update({ hasCompletedProfile: true }, { transaction })
      }

      await transaction.commit()

      logger.info(`Profile updated for user: ${userId}`)
      res.json({
        status: 'success',
        message: 'Profile updated successfully',
      })
    } catch (error) {
      await transaction.rollback()
      logger.error('Update profile error:', error)
      next(error)
    }
  }

  // Users create Preference
  async createPreferences(req, res, next) {
    try {
      const data = req.body
      const { error } = validateUserPreference(data)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const userId = req.user.id

      // Check if preferences already exist
      const existing = await UserPreference.findOne({
        where: { user_id: userId },
      })
      if (existing) {
        throw new ValidationError(
          'Preferences already exist. Use update instead.'
        )
      }

      const userPreference = await UserPreference.create({
        ...data,
        userId,
      })

      res.status(201).json({
        status: 'success',
        message: 'Preferences created successfully',
        data: userPreference,
      })
    } catch (error) {
      logger.error('Create preferences error:', error)
      next(error)
    }
  }

  // Update user preferences
  async updatePreferences(req, res, next) {
    try {
      const data = req.body
      const { error } = validateUserPreference(data)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const userId = req.user.id

      const userPreference = await UserPreference.findOne({
        where: { user_id: userId },
      })
      if (!userPreference) {
        throw new ValidationError(
          'Preferences not found. Please create them first.'
        )
      }

      await userPreference.update(data)

      res.json({
        status: 'success',
        message: 'Preferences updated successfully',
        data: userPreference,
      })
    } catch (error) {
      logger.error('Update preferences error:', error)
      next(error)
    }
  }
  // Upload profile picture
  async uploadProfilePicture(req, res, next) {
    try {
      const userId = req.user.id

      if (!req.file) {
        throw new ValidationError('No file uploaded')
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
        use_filename: true,
      })

      // Delete local file after successful upload
      await fs.unlink(req.file.path)

      // Update user profile with new picture URL
      const userProfile = await UserProfile.findOne({
        where: { user_id: userId },
      })

      if (!userProfile) {
        throw new ValidationError('User profile not found')
      }

      await userProfile.update({
        profilePicture: result.secure_url,
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
      logger.error('Upload profile picture error:', error)
      next(error)
    }
  }

  // Get user history
  async getUserHistory(req, res, next) {
    try {
      const userId = req.params.id
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      // Ensure user can only access their own history
      if (req.user.id !== parseInt(userId) && req.user.role !== 'super_admin') {
        throw new ValidationError('Unauthorized to access this history')
      }

      const offset = (page - 1) * limit

      const history = await User.findByPk(userId, {
        include: [
          {
            model: Appointment,
            as: 'appointments',
            limit,
            offset,
            order: [['created_at', 'DESC']],
            include: [
              {
                model: Hospital,
                as: 'hospital',
                attributes: ['name', 'location'],
              },
            ],
          },
          {
            model: Prescription,
            as: 'prescriptions',
            limit,
            offset,
            order: [['created_at', 'DESC']],
          },
          {
            model: PatientVitals,
            as: 'vitals',
            limit,
            offset,
            order: [['recorded_at', 'DESC']],
          },
        ],
      })

      if (!history) {
        throw new ValidationError('User not found')
      }

      logger.info(`History retrieved for user: ${userId}`)

      res.json({
        status: 'success',
        data: {
          history,
        },
      })
    } catch (error) {
      logger.error('Get user history error:', error)
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
        throw new ValidationError('Notification not found')
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

  // Create Patient Vitals
  async createPatientVital(req, res, next) {
    const data = req.body
    const { error } = validatePatientVital(data)
    if (error) {
      return next(new ValidationError(error.details[0].message))
    }

    const transaction = await User.sequelize.transaction()
    try {
      const userId = req.user.id
      data.patientId = userId

      const existingVital = await PatientVitals.findOne({
        where: { patient_id: userId },
        transaction,
      })

      if (existingVital) {
        throw new ValidationError('Vitals already exist. Use update instead.')
      }

      await PatientVitals.create(data, { transaction })
      await transaction.commit()

      res.json({
        status: 'success',
        message: 'Patient vitals created successfully',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  }

  // Update patient vital
  async updatePatientVital(req, res, next) {
    const data = req.body
    const { error } = validatePatientVital(data)
    if (error) {
      return next(new ValidationError(error.details[0].message))
    }

    const transaction = await User.sequelize.transaction()
    try {
      const userId = req.user.id
      const patientVital = await PatientVitals.findOne({
        where: { patient_id: userId },
        transaction,
      })

      if (!patientVital) {
        throw new ValidationError('Vitals not found. Create first.')
      }

      await patientVital.update(data, { transaction })
      await transaction.commit()

      res.json({
        status: 'success',
        message: 'Patient vitals updated successfully',
      })
    } catch (error) {
      await transaction.rollback()
      next(error)
    }
  }
}
module.exports = UserController
