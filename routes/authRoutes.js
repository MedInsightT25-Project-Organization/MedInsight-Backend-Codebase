const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const {authenticate} = require('../middleware/auth')
const { rateLimiter } = require('../middleware/rateLimiter')

const authController = new AuthController()

// Public routes
router.post('/register/patient', authController.registerPatient)
router.post('/register/practitioner', authController.registerPractitioner)
router.post('/register/admin', authController.registerAdmin)
router.post('/login', rateLimiter, authController.login)
router.post('/google', authController.googleLogin)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', rateLimiter, authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/send-verification-email', authenticate, authController.sendEmailVerification)
router.post('/verify-email', authController.verifyEmail)
router.post('/change-password', authenticate, authController.changePassword)

// Protected routes
router.post('/logout', authenticate, authController.logout)
router.get('/session', authenticate, authController.getSession)

module.exports = router
