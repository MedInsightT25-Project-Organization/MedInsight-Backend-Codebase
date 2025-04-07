const User = require('../db/models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const { cacheClient } = require('../config/redis')
const { logger } = require('../utils/logger')
const {
  validateRegistration,
  validateLogin,
} = require('../validators/authValidator')
const {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
} = require('../utils/email')
const { generateToken, generateRefreshToken } = require('../utils/jwt')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class AuthController {
  // Register a new user
  async register(req, res) {
    try {
      const { error } = validateRegistration(req.body)
      if (error) {
        return res.status(400).json({ error: error.details[0].message })
      }

      const { email, password, role, firstName, lastName } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
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
        await sendWelcomeEmail(user.email, user.firstName)
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError)
        // Continue with registration even if email fails
      }

      logger.info(`User registered successfully: ${user.id}`)

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
        refreshToken,
      })
    } catch (error) {
      logger.error('Registration error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { error } = validateLogin(req.body)
      if (error) {
        return res.status(400).json({ error: error.details[0].message })
      }

      const { email, password } = req.body

      // Find user
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
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
          user.firstName,
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
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
        refreshToken,
      })
    } catch (error) {
      logger.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Google OAuth login
  async googleLogin(req, res) {
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
          firstName: given_name,
          lastName: family_name,
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
          await sendWelcomeEmail(user.email, user.firstName)
        } catch (emailError) {
          logger.error(
            'Failed to send welcome email for Google login:',
            emailError
          )
        }
      }

      // Send login notification email
      try {
        const loginTime = new Date().toLocaleString()
        const ipAddress = req.ip
        const deviceInfo = req.headers['user-agent'] || 'Unknown device'

        await sendLoginNotificationEmail(
          user.email,
          user.firstName,
          loginTime,
          ipAddress,
          deviceInfo
        )
      } catch (emailError) {
        logger.error(
          'Failed to send login notification email for Google login:',
          emailError
        )
      }

      logger.info(`User logged in with Google: ${user.id}`)

      res.json({
        message: 'Google login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
        },
        token: jwtToken,
        refreshToken,
      })
    } catch (error) {
      logger.error('Google login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' })
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

      // Check if refresh token exists in Redis
      const storedToken = await cacheClient.get(`refresh_token:${decoded.id}`)
      if (!storedToken || storedToken !== refreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' })
      }

      // Get user
      const user = await User.findByPk(decoded.id)
      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }

      // Generate new tokens
      const newToken = generateToken(user)
      const newRefreshToken = generateRefreshToken(user)

      // Update refresh token in Redis
      await cacheClient.set(
        `refresh_token:${user.id}`,
        newRefreshToken,
        'EX',
        7 * 24 * 60 * 60
      )

      logger.info(`Token refreshed for user: ${user.id}`)

      res.json({
        token: newToken,
        refreshToken: newRefreshToken,
      })
    } catch (error) {
      logger.error('Token refresh error:', error)
      res.status(401).json({ error: 'Invalid refresh token' })
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const { refreshToken } = req.body
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        await cacheClient.del(`refresh_token:${decoded.id}`)
      }

      logger.info(`User logged out: ${req.user.id}`)
      res.json({ message: 'Logged out successfully' })
    } catch (error) {
      logger.error('Logout error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Request password reset
  async forgotPassword(req, res) {
    try {
      const { email } = req.body

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Generate reset token
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      })

      // Store reset token in Redis
      await cacheClient.set(`reset_token:${user.id}`, resetToken, 'EX', 3600)

      // Send reset email
      await sendPasswordResetEmail(user.email, resetToken)

      logger.info(`Password reset requested for user: ${user.id}`)

      res.json({ message: 'Password reset email sent' })
    } catch (error) {
      logger.error('Forgot password error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Check if token exists in Redis
      const storedToken = await cacheClient.get(`reset_token:${decoded.id}`)
      if (!storedToken || storedToken !== token) {
        return res.status(401).json({ error: 'Invalid or expired reset token' })
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await User.update(
        { password: hashedPassword },
        { where: { id: decoded.id } }
      )

      // Delete reset token from Redis
      await cacheClient.del(`reset_token:${decoded.id}`)

      logger.info(`Password reset successful for user: ${decoded.id}`)

      res.json({ message: 'Password reset successful' })
    } catch (error) {
      logger.error('Reset password error:', error)
      res.status(401).json({ error: 'Invalid or expired reset token' })
    }
  }

  // Get current user session
  async getSession(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
      })

      res.json({ user })
    } catch (error) {
      logger.error('Get session error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

module.exports = new AuthController()
