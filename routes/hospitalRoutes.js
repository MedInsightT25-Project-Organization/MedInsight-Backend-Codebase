const express = require('express')
const router = express.Router()
const HospitalController = require('../controllers/hospitalController')
const ServiceController = require('../controllers/serviceController')
const {
  authenticate,
  isHospitalAdmin,
} = require('../middleware/auth')
const upload = require('../config/multer')

const hospitalController = new HospitalController()
const serviceController = new ServiceController()

// Apply authentication middleware to all routes
router.use(authenticate)

// Hospital routes
router.post('/profile/create', isHospitalAdmin, hospitalController.createHospital)
router.put('/profile/update', isHospitalAdmin, hospitalController.updateHospital)
router.get('/profile/local-government', hospitalController.getHospitals)
router.get('/profile/:id', hospitalController.getHospitalById)
router.get('/profile', hospitalController.getHospitalProfile)

router.post( '/hospital-picture/upload', isHospitalAdmin, upload.single('profilePicture'), hospitalController.uploadHospitalPicture)

router.post( '/notifications/:id/read', isHospitalAdmin, hospitalController.markNotificationAsRead)

router.delete( '/delete/:id', isHospitalAdmin, hospitalController.deleteHospitalById )

// Service routes
router.post( '/create/:hospitalId/services', isHospitalAdmin, serviceController.createHospitalServices)
router.get( '/:hospitalId/services', serviceController.getHospitalServices)
router.get( '/:hospitalId/services/:serviceId', isHospitalAdmin, serviceController.getHospitalServicesById )
router.put( '/update/:hospitalId/services/:serviceId', isHospitalAdmin, serviceController.updateHospitalServicesById)
router.delete( '/:hospitalId/services/:serviceId', isHospitalAdmin, serviceController.deleteService)

module.exports = router
