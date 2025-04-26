const express = require('express')
const router = express.Router()
const HospitalController = require('../controllers/hospitalController')
const ServiceController = require('../controllers/serviceController')
const {
  authenticate,
  isHospitalAdmin,
  isSuperAdmin,
} = require('../middleware/auth')
const upload = require('../config/multer')

const hospitalController = new HospitalController()
const serviceController = new ServiceController()

// Apply authentication middleware to all routes
router.use(authenticate)
router.use(isHospitalAdmin)

// Hospital routes
router.post('/profile/create', hospitalController.createHospital)
router.put('/profile/update', hospitalController.updateHospital)
router.get('/profile/local-government', hospitalController.getHospitals)
router.get('/profile/:id', hospitalController.getHospitalById)
router.get('/profile', hospitalController.getHospitalProfile)

router.post(
  '/hospital-picture/upload',
  upload.single('profilePicture'),
  hospitalController.uploadHospitalPicture
)

router.post(
  '/notifications/:id/read',
  hospitalController.markNotificationAsRead
)

router.delete(
  '/delete/:id',
  authenticate,
  isSuperAdmin,
  hospitalController.deleteHospitalById
)

// Service routes
router.post(
  '/create/:hospitalId/services',
  authenticate,
  isHospitalAdmin,
  serviceController.createHospitalServices
)
router.get('/:hospitalId/services', serviceController.getHospitalServices)
router.get(
  '/:hospitalId/services/:serviceId',
  authenticate,
  isHospitalAdmin,
  serviceController.getHospitalServicesById
)
router.put(
  '/update/:hospitalId/services/:serviceId',
  authenticate,
  isHospitalAdmin,
  serviceController.updateHospitalServicesById
)
router.delete(
  '/:hospitalId/services/:serviceId',
  authenticate,
  isHospitalAdmin,
  serviceController.deleteService
)

module.exports = router
