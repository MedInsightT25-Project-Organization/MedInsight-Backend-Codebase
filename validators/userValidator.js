const Joi = require('joi')

const validateUserProfile = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    gender: Joi.string().required(),
    dob: Joi.date().required(),
    profilePicture: Joi.string().required(),    
    
})

const validateUserPreference = Joi.object({
    preferences: Joi.array().required(),
})
const validateProfilePicture = Joi.object({
    profilePicture: Joi.string().required(),
})

const validatePatientVital = Joi.object({})

module.exports = {
    validateUserProfile,
    validateUserPreference,
    validateProfilePicture,
    validatePatientVital,
}
