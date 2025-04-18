const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const userController = require('../controllers/userController')
const { authenticate } = require('../middleware/auth')



// Apply authentication middleware to all routes
router.use(authenticate)

// Profile routes
router.get('/profile', userController.getProfile)
router.post('/profile/update', userController.updateProfile)
router.post('/profile/create', userController.createProfile)
router.post('/profile/vital', userController.updatePatientVital)

// Preferences routes
router.post('/preferences/upload', userController.uploadPreferences)

// Profile picture routes
router.post('/profile-picture/upload', 
  upload.single('profilePicture'), 
  userController.uploadProfilePicture
)

// History routes
router.get('/history/:id', userController.getUserHistory)

// Notification routes
router.post('/notifications/:id/read', userController.markNotificationAsRead)

module.exports = router
