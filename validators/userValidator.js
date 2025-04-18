const Joi = require('joi')

const validateUserProfile = (data) => {
    const schema = Joi.object({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    gender: Joi.string().required(),
    dob: Joi.date().required(),
    localGovernment: Joi.string().required(),
    gender: Joi.string().required(),
    emergencyContact: Joi.string().required(),
    emergencyContactNumber: Joi.string().required(),
    })
    return schema.validate(data)
}

const validateUserPreference = (data) => {
    const schema = Joi.object({
        preferences: Joi.array().required(),
    })
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
        vital: Joi.object().required(),
    })
    return schema.validate(data)
}

module.exports = {
    validateUserProfile,
    validateUserPreference,
    validateProfilePicture,
    validatePatientVital,
}
