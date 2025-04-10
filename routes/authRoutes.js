const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/authController')
const {
  validateRegistration,
  validateLogin,
} = require('../validators/authValidator')
const auth = require('../middleware/auth')
const { rateLimiter } = require('../middleware/rateLimiter')

const authController = new AuthController()

// Public routes
router.post(
  '/register/patient',
  validateRegistration,
  authController.registerPatient
)
router.post(
  '/register/practitioner',
  validateRegistration,
  authController.registerPractitioner
)
router.post(
  '/register/admin',
  validateRegistration,
  authController.registerAdmin
)
router.post('/login', validateLogin, authController.login)
router.post('/google', authController.googleLogin)
router.post('/refresh-token', authController.refreshToken)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

// Protected routes
router.post('/logout', auth, authController.logout)
router.get('/session', auth, authController.getSession)

module.exports = router
