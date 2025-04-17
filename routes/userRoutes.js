const express = require('express')
const router = express.Router()
const multer = require('multer')
const userController = require('../controllers/userController')
const { authenticate } = require('../middleware/auth')

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Apply authentication middleware to all routes
router.use(authenticate)

// Profile routes
router.get('/profile', userController.getProfile)
router.post('/profile/update', userController.updateProfile)

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
