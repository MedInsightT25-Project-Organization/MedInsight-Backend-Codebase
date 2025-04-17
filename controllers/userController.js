const { User, UserProfile, UserPreference, Notification, PatientVitals } = require('../db/models')
const { logger } = require('../utils/logger')
const { ValidationError } = require('../utils/errors')
const cloudinary = require('cloudinary').v2
const  {  validateUserProfile, validateUserPreference,validateProfilePicture, validatePatientVital,} = require('./validators/userValidator')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

class UserController {
  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id

      const user = await User.findByPk(userId, {
        include: [
          {
            model: UserProfile,
            as: 'userProfile',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id']
            }
          },
          {
            model: UserPreference,
            as: 'userPreference',
            attributes: {
              exclude: ['created_at', 'updated_at', 'user_id']
            }
          }
        ],
        attributes: {
          exclude: ['password_hash', 'created_at', 'updated_at', 'deleted_at']
        }
      })

      if (!user) {
        throw new ValidationError('User not found')
      }

      logger.info(`Profile retrieved for user: ${userId}`)

      res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (error) {
      logger.error('Get profile error:', error)
      throw error
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id
      const {
        fullName,
        emailAddress,
        phoneNumber,
        dateOfBirth,
        gender,
        address,
        occupation,
        emergencyContactNumber,
        profilePicture,
      } = req.body

      // Start a transaction
      const transaction = await User.sequelize.transaction()

      try {
        // Update user profile
        const [userProfile] = await UserProfile.findOrCreate({
          where: { user_id: userId },
          defaults: { user_id: userId },
          transaction
        })

        await userProfile.update({
          full_name: fullName,
          email_address: emailAddress,
          phone_number: phoneNumber,
          date_of_birth: dateOfBirth,
          gender,
          address,
          occupation,
          emergency_contact_number: emergencyContactNumber,
          profile_picture: profilePicture,
        }, { transaction })

        // Update user's profile completion status
        await User.update(
          { has_completed_profile: true },
          { where: { id: userId }, transaction }
        )

        // Commit the transaction
        await transaction.commit()

        logger.info(`Profile updated for user: ${userId}`)

        res.json({
          status: 'success',
          message: 'Profile updated successfully'
        })
      } catch (error) {
        // Rollback the transaction if there's an error
        await transaction.rollback()
        throw error
      }
    } catch (error) {
      logger.error('Update profile error:', error)
      throw error
    }
  }

  // Upload user preferences
  async uploadPreferences(req, res) {
    try {
      const userId = req.user.id
      const { language, darkMode, notificationPreferences } = req.body

      const [userPreference] = await UserPreference.findOrCreate({
        where: { user_id: userId },
        defaults: { user_id: userId }
      })

      await userPreference.update({
        language,
        dark_mode: darkMode,
        notification_preferences: notificationPreferences
      })

      logger.info(`Preferences updated for user: ${userId}`)

      res.json({
        status: 'success',
        message: 'Preferences updated successfully'
      })
    } catch (error) {
      logger.error('Update preferences error:', error)
      throw error
    }
  }

  // Upload profile picture
  async uploadProfilePicture(req, res) {
    try {
      const userId = req.user.id

      if (!req.file) {
        throw new ValidationError('No file uploaded')
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
        use_filename: true
      })

      // Update user profile with new picture URL
      const userProfile = await UserProfile.findOne({
        where: { user_id: userId }
      })

      if (!userProfile) {
        throw new ValidationError('User profile not found')
      }

      await userProfile.update({
        profile_picture: result.secure_url
      })

      logger.info(`Profile picture updated for user: ${userId}`)

      res.json({
        status: 'success',
        message: 'Profile picture updated successfully',
        data: {
          url: result.secure_url
        }
      })
    } catch (error) {
      logger.error('Upload profile picture error:', error)
      throw error
    }
  }

  // Get user history
  async getUserHistory(req, res) {
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
                attributes: ['name', 'location']
              }
            ]
          },
          {
            model: Prescription,
            as: 'prescriptions',
            limit,
            offset,
            order: [['created_at', 'DESC']]
          },
          {
            model: PatientVitals,
            as: 'vitals',
            limit,
            offset,
            order: [['recorded_at', 'DESC']]
          }
        ]
      })

      if (!history) {
        throw new ValidationError('User not found')
      }

      logger.info(`History retrieved for user: ${userId}`)

      res.json({
        status: 'success',
        data: {
          history
        }
      })
    } catch (error) {
      logger.error('Get user history error:', error)
      throw error
    }
  }

  // Mark notification as read
  async markNotificationAsRead(req, res) {
    try {
      const userId = req.user.id
      const notificationId = req.params.id

      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          user_id: userId
        }
      })

      if (!notification) {
        throw new ValidationError('Notification not found')
      }

      await notification.update({
        is_read: true
      })

      logger.info(`Notification ${notificationId} marked as read for user: ${userId}`)

      res.json({
        status: 'success',
        message: 'Notification marked as read'
      })
    } catch (error) {
      logger.error('Mark notification as read error:', error)
      throw error
    }
  }
  async updatePatientVital(req, res) {
    const data = req.body;
    validatePatientVital(data)
    
  }
  
}

module.exports = new UserController()
