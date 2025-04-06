const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { authenticate } = require('../middleware/auth')
const { rateLimiter } = require('../middleware/rateLimiter')

// Public routes
router.post('/register', rateLimiter, authController.register)
router.post('/login', rateLimiter, authController.login)
router.post('/google', rateLimiter, authController.googleLogin)
router.post('/forgot-password', rateLimiter, authController.forgotPassword)
router.post('/reset-password', rateLimiter, authController.resetPassword)
router.post('/refresh-token', rateLimiter, authController.refreshToken)

// Protected routes
router.post('/logout', authenticate, authController.logout)
router.get('/session', authenticate, authController.getSession)

module.exports = router
