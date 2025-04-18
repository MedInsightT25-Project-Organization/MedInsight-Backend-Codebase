const express = require('express')
const router = express.Router()
const HospitalController = require('../controllers/hospitalController')
const ServiceController = require('../controllers/serviceController')
const { authenticate, isHospitalAdmin,isSuperAdmin } = require('../middleware/auth')

const hospitalController = new HospitalController()
const serviceController = new ServiceController()

// Hospital routes
router.post(
  '/',
  authenticate,
  isHospitalAdmin,
  hospitalController.createHospital
)
router.get('/', hospitalController.getHospitals)
router.get('/:id', hospitalController.getHospitalById)
router.put(
  '/:id',
  authenticate,
  isHospitalAdmin,
  hospitalController.updateHospital
)
router.delete(
  '/:id',
  authenticate,
  isSuperAdmin,
  hospitalController.deleteHospital
)

// Service routes
router.post(
  '/:hospitalId/services',
  authenticate,
  isHospitalAdmin,
  serviceController.createService
)
router.get('/:hospitalId/services', serviceController.getHospitalServices)
router.put(
  '/services/:id',
  authenticate,
  isHospitalAdmin,
  serviceController.updateService
)
router.delete(
  '/services/:id',
  authenticate,
  isHospitalAdmin,
  serviceController.deleteService
)

module.exports = router
