require('dotenv').config
const User = require('../db/models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const { cacheClient } = require('../config/redis')
const { logger } = require('../utils/logger')
const {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateEmail
} = require('../validators/authValidator')
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendVerificationEmail,
} = require('../utils/email')
const { generateToken, generateRefreshToken } = require('../utils/jwt')
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} = require('../utils/errors')
const Notification = require('../db/models/notification')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class AuthController {
  // Register a new patient
  async registerPatient(req, res, next) {
    try {
      const { error } = validateRegistration(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const { email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new ValidationError('Email already registered')
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12)

      // Create user
      const user = await User.create({
        email,
        passwordHash,
        role: 'patient',
      })

      // Generate tokens
      const token = generateToken(user)
      const refreshToken = generateRefreshToken(user)

      // Store refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      // Send welcome email
      try {
        await sendWelcomeEmail(user.email || 'User')
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError)
        // Continue with registration even if email fails
      }

      logger.info(`Patient registered successfully: ${user.id}`)

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      })
    } catch (error) {
      logger.error('Registration error:', error)
      next(error)
    }
  }

  // Register a new practitioner
  async registerPractitioner(req, res, next) {
    try {
      const { error } = validateRegistration(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const { email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new ValidationError('Email already registered')
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12)

      // Create user
      const user = await User.create({
        email,
        passwordHash,
        role: 'hospital_admin',
      })

      // Generate tokens
      const token = generateToken(user)
      const refreshToken = generateRefreshToken(user)

      // Store refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      // Send welcome email
      try {
        await sendWelcomeEmail(user.email, user.fullName || 'User')
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError)
        // Continue with registration even if email fails
      }

      logger.info(`Practitioner registered successfully: ${user.id}`)

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      })
    } catch (error) {
      logger.error('Registration error:', error)
      next(error)
    }
  }

  // Register a new admin
  async registerAdmin(req, res, next) {
    try {
      const { error } = validateRegistration(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const { email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new ValidationError('Email already registered')
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12)

      // Create user
      const user = await User.create({
        email,
        passwordHash,
        role: 'super_admin',
      })

      // Generate tokens
      const token = generateToken(user)
      const refreshToken = generateRefreshToken(user)

      // Store refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      // Send welcome email
      try {
        await sendWelcomeEmail(user.email, user.fullName || 'User')
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError)
        // Continue with registration even if email fails
      }

      logger.info(`Admin registered successfully: ${user.id}`)

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      })
    } catch (error) {
      logger.error('Registration error:', error)
      next(error)
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { error } = validateLogin(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }

      const { email, password } = req.body

      // Find user
      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw new AuthenticationError('Invalid credentials')
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash)
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials')
      }

      // Generate tokens
      const token = generateToken(user)
      const refreshToken = generateRefreshToken(user)

      // Store refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      // Send login notification email
      try {
        const loginTime = new Date().toLocaleString()
        const ipAddress = req.ip
        const deviceInfo = req.headers['user-agent'] || 'Unknown device'

        await sendLoginNotificationEmail(
          user.email,
          user.fullName || 'User',
          loginTime,
          ipAddress,
          deviceInfo
        )
      } catch (emailError) {
        logger.error('Failed to send login notification email:', emailError)
        // Continue with login even if email fails
      }

      logger.info(`User logged in successfully: ${user.id}`)

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
        token,
        refreshToken,
      })
    } catch (error) {
      logger.error('Login error:', error)
      next(error)
    }
  }

  // Google OAuth login
  async googleLogin(req, res, next) {
    try {
      const { token } = req.body

      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const { email, given_name, family_name, picture } = ticket.getPayload()

      // Find or create user
      let user = await User.findOne({ where: { email } })
      let isNewUser = false

      if (!user) {
        user = await User.create({
          email,
          fullName: `${given_name} ${family_name}`,
          profilePicture: picture,
          role: 'patient', // Default role for Google OAuth users
          isEmailVerified: true, // Google emails are verified
        })
        isNewUser = true
      }

      // Generate tokens
      const jwtToken = generateToken(user)
      const refreshToken = generateRefreshToken(user)

      // Store refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        refreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      // Send welcome email for new users
      if (isNewUser) {
        try {
          await sendWelcomeEmail(user.email, user.fullName || 'User')
        } catch (emailError) {
          logger.error('Failed to send welcome email:', emailError)
        }
      }

      // Send login notification email
      try {
        const loginTime = new Date().toLocaleString()
        const ipAddress = req.ip
        const deviceInfo = req.headers['user-agent'] || 'Unknown device'

        await sendLoginNotificationEmail(
          user.email,
          user.fullName || 'User',
          loginTime,
          ipAddress,
          deviceInfo
        )
      } catch (emailError) {
        logger.error('Failed to send login notification email:', emailError)
      }

      logger.info(`User logged in with Google: ${user.id}`)

      res.json({
        message: 'Google login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        },
        token: jwtToken,
        refreshToken,
      })
    } catch (error) {
      logger.error('Google login error:', error)
      next(error)
    }
  }

  // Refresh token
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        throw new ValidationError('Refresh token is required')
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

      // Get user
      const user = await User.findByPk(decoded.id)
      if (!user) {
        throw new AuthenticationError('User not found')
      }

      // Check if refresh token exists in Redis
      const storedToken = await cacheClient.get(`refresh_token:${user.id}`)
      if (!storedToken || storedToken !== refreshToken) {
        throw new AuthenticationError('Invalid refresh token')
      }

      // Generate new tokens
      const token = generateToken(user)
      const newRefreshToken = generateRefreshToken(user)

      // Update refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        newRefreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      res.json({
        message: 'Token refreshed successfully',
        token,
        refreshToken: newRefreshToken,
      })
    } catch (error) {
      logger.error('Token refresh error:', error)
      next(error)
    }
  }

  // Logout user
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken){
        throw new ValidationError('Refresh Token Required')
      }

      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        await cacheClient.del(`refresh_token:${decoded.id}`)
      }

      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      logger.error('Logout error:', error)
      next(error)
    }
  }

  // Forgot password
  async forgotPassword(req, res, next) {
    try {
      const { error } = validateEmail(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }
      const { email } = req.body

      // Find user
      const user = await User.findOne({ where: { email } })
      if (!user) {
        // Return success even if user doesn't exist (security)
        return res.json({
          message: 'Password reset email sent if account exists',
        })
      }

      // Generate reset token
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })

      // Store reset token in Redis
      await cacheClient.set(`reset_token:${user.id}`, resetToken, 'EX', 3600)

      // Send reset email
      await sendPasswordResetEmail(user.email, resetToken)

      res.json({ message: 'Password reset email sent if account exists' })
    } catch (error) {
      logger.error('Forgot password error:', error)
      next(error)
    }
  }

  // Reset password
  async resetPassword(req, res, next) {
    try {
      const { error } = validatePasswordReset(req.body)
      if (error) {
        throw new ValidationError(error.details[0].message)
      }
      const { token, newPassword} = req.body

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user
      const user = await User.findByPk(decoded.id)
      if (!user) {
        throw new AuthenticationError('User not found')
      }

      // Check if token exists in Redis
      const storedToken = await cacheClient.get(`reset_token:${decoded.id}`)
      if (!storedToken || storedToken !== token) {
        throw new AuthenticationError('Invalid or expired reset token')
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10)

      // Update password
      await user.update({ passwordHash })

      // Delete reset token from Redis
      await cacheClient.del(`reset_token:${decoded.id}`)

      logger.info(`Password reset successful for user: ${decoded.id}`)

      res.json({ message: 'Password reset successfully' })
    } catch (error) {
      logger.error('Reset password error:', error)
      next(error)
    }
  }

  // Send Email Verification
  async sendEmailVerification(req, res, next) {
    const loggedInUser = req.user
    try {
      const email = loggedInUser.email

      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw new AuthenticationError('User not found')
      }
      if (user.isEmailVerified === true) {
        throw new AuthenticationError('Email already verified')
      }

      const verificationToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      )
      await cacheClient.set(
        `verification_token:${user.id}`,
        verificationToken,
        'EX',
        3600
      )

      await sendVerificationEmail(user.email, verificationToken)

      res.json({ message: 'Email verification sent' })
    } catch (error) {
      logger.error('Send email verification error:', error)
      next(error)
    }
  }

  // verify email
  async verifyEmail(req, res, next) {
    try {
      const token = req.body.token || req.params.token

      if (!token){
        throw new ValidationError('Email Verification Token is Required')
      }
      // Verify token first
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get stored token from Redis
      const storedToken = await cacheClient.get(
        `verification_token:${decoded.id}`
      )

      if (!storedToken || storedToken !== token) {
        throw new AuthenticationError('Invalid or expired verification token')
      }

      // Get user from database
      const user = await User.findByPk(decoded.id)

      if (!user) {
        throw new AuthenticationError('User not found')
      }

      if (user.isEmailVerified === true) {
        throw new AuthenticationError('Email already verified')
      }

      // Update user's email verification status
      await user.update({ isEmailVerified: true })

      // Delete the verification token from Redis
      await cacheClient.del(`verification_token:${decoded.id}`)

      res.json({ message: 'Email verified successfully' })
    } catch (error) {
      logger.error('Verify email error:', error)
      next(error)
    }
  }

  // Change Password
  async changePassword(req, res, next) {
    const loggedInUser = req.user
    try {
      
      const { oldPassword, newPassword, confirmPassword } = req.body

      if(!oldPassword || !newPassword || !confirmPassword){
        throw new ValidationError('You are required to complete all fields')
      }
      
      if (newPassword !== confirmPassword) {
        throw new AuthenticationError(
          'New password and confirm password do not match'
        )
      }

      const user = await User.findByPk(loggedInUser.id)

      if (!user) {
        throw new AuthenticationError('User not found')
      }

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        user.passwordHash
      )

      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid old password')
      }

      const passwordHash = await bcrypt.hash(newPassword, 10)

      await user.update({ passwordHash })

      res.json({ message: 'Password changed successfully' })
    } catch (error) {
      logger.error('Change password error:', error)
      next(error)
    }
  }

  // Get current session
  async getSession(req, res, next) {
    try {
      const user = req.user

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        },
      })
    } catch (error) {
      logger.error('Get session error:', error)
      next(error)
    }
  }

  // Mark notification as read
  async markNotificationAsRead(req, res, next) {
    try {
      const { notificationId } = req.params
      const userId = req.user.id

      // Find the notification
      const notification = await Notification.findOne({
        where: {
          id: notificationId,
          userId: userId,
        },
      })

      if (!notification) {
        throw new NotFoundError('Notification not found')
      }

      // Update notification status
      await notification.update({ isRead: true })

      res.status(200).json({
        status: 'success',
        message: 'Notification marked as read',
        data: notification,
      })
    } catch (error) {
      logger.error('Mark notification as read error:', error)
      next(error)
    }
  }
}

module.exports = AuthController
