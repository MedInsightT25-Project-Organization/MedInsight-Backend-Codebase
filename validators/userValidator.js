const Joi = require('joi')

const validateUserProfile = (data) => {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      address: Joi.string().required(),
      dob: Joi.date().required(),
      localGovernment: Joi.string().required(),
      gender: Joi.string().required(),
      emergencyContact: Joi.string().required(),
      emergencyContactNumber: Joi.string().required(),
      occupation: Joi.string().required(),
    })
    return schema.validate(data)
}

const validateUserPreference = (data) => {
    const schema = Joi.object({
  language: Joi.string().min(2).max(20).optional(),
  darkMode: Joi.boolean().optional()
});
    return schema.validate(data)
    }
const validateProfilePicture = (data) => {
    const schema = Joi.object({
    profilePicture: Joi.string().required(),
    })
    return schema.validate(data)
}

    const validatePatientVital = (data) => {
      const schema = Joi.object({
        heartRate: Joi.number().integer().min(30).max(200).optional(),
        bloodPressure: Joi.string()
          .pattern(/^\d{2,3}\/\d{2,3}$/)
          .optional(), // e.g. 120/80
        weight: Joi.number().min(1).max(500).precision(2).optional(),
        bodyTemperature: Joi.number().min(30).max(45).precision(1).optional(),
      })

      return schema.validate(data)
    }


module.exports = {
    validateUserProfile,
    validateUserPreference,
    validateProfilePicture,
    validatePatientVital,
}
