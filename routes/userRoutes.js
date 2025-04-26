const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const UserController = require('../controllers/userController')
const { authenticate, isPatient } = require('../middleware/auth')

const userController = new UserController()

// Apply authentication middleware to all routes
router.use(authenticate)

// Profile routes
router.get('/profile', userController.getProfile)
router.get('/profile/:id', userController.getProfileById)
router.patch('/profile/update', isPatient, userController.updateProfile)
router.post('/profile/create', isPatient, userController.createProfile)
router.post('/vitals/create', isPatient, userController.createPatientVital)
router.patch('/vitals/update', isPatient, userController.updatePatientVital)

// Preferences routes
router.post('/preferences/create', isPatient, userController.createPreferences)
router.patch('/preferences/update', isPatient, userController.updatePreferences)

// Profile picture routes
router.post('/profile-picture/upload', isPatient, upload.single('profilePicture'), userController.uploadProfilePicture)

// History routes
router.get('/history/:id', isPatient, userController.getUserHistory)

// Notification routes
router.post('/notifications/:id/read', isPatient, userController.markNotificationAsRead)

module.exports = router
