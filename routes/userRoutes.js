const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const UserController = require('../controllers/userController')
const { authenticate, isPatient } = require('../middleware/auth')

const userController = new UserController()

// Apply authentication middleware to all routes
router.use(authenticate)
router.use(isPatient)

// Profile routes
router.get('/profile', userController.getProfile)
router.get('/profile/:id', userController.getProfileById)
router.patch('/profile/update', userController.updateProfile)
router.post('/profile/create', userController.createProfile)
router.post('/vitals/create', userController.createPatientVital)
router.patch('/vitals/update', userController.updatePatientVital)

// Preferences routes
router.post('/preferences/create', userController.createPreferences)
router.patch('/preferences/update', userController.updatePreferences)

// Profile picture routes
router.post(
  '/profile-picture/upload',
  upload.single('profilePicture'),
  userController.uploadProfilePicture
)

// History routes
router.get('/history/:id', userController.getUserHistory)

// Notification routes
router.post('/notifications/:id/read', userController.markNotificationAsRead)

module.exports = router
