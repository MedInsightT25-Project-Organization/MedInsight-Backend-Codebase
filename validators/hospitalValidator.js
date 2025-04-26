const Joi = require('joi')

const validateHospital = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100).messages({
      'string.empty': 'Hospital name is required',
      'string.min': 'Hospital name must be at least 3 characters long',
      'string.max': 'Hospital name cannot exceed 100 characters',
    }),

    latitude: Joi.number().min(-90).max(90).messages({
      'number.min': 'Latitude must be between -90 and 90 degrees',
      'number.max': 'Latitude must be between -90 and 90 degrees',
    }),

    longitude: Joi.number().min(-180).max(180).messages({
      'number.min': 'Longitude must be between -180 and 180 degrees',
      'number.max': 'Longitude must be between -180 and 180 degrees',
    }),

    address: Joi.string().required().min(5).max(255).messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 255 characters',
    }),

    contactNumber: Joi.string()
      .required()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .messages({
        'string.empty': 'Contact number is required',
        'string.pattern.base': 'Contact number must be a valid phone number',
      }),

    state: Joi.string().min(2).max(50).messages({
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State cannot exceed 50 characters',
    }),

    country: Joi.string().min(2).max(50).messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country cannot exceed 50 characters',
    }),

    city: Joi.string().min(2).max(50).messages({
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City cannot exceed 50 characters',
    }),

    localGovernmentArea: Joi.string().required().min(2).max(100).messages({
      'string.empty': 'Local Government Area is required',
      'string.min': 'Local Government Area must be at least 2 characters long',
      'string.max': 'Local Government Area cannot exceed 100 characters',
    }),

    postalCode: Joi.string()
      .pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
      .messages({
        'string.pattern.base':
          'Postal code must be a valid format (e.g., 12345 or 12345-6789)',
      }),

    serviceSummary: Joi.string().required().min(10).max(500).messages({
      'string.empty': 'Service summary is required',
      'string.min': 'Service summary must be at least 10 characters long',
      'string.max': 'Service summary cannot exceed 500 characters',
    }),

    workHours: Joi.string()
      .pattern(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      )
      .messages({
        'string.pattern.base': 'Work hours must be in the format HH:MM-HH:MM',
      }),
  })

  return schema.validate(data, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: true, // Remove unknown properties
  })
}

const validateHospitalUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).messages({
      'string.min': 'Hospital name must be at least 3 characters long',
      'string.max': 'Hospital name cannot exceed 100 characters',
    }),

    latitude: Joi.number().min(-90).max(90).messages({
      'number.min': 'Latitude must be between -90 and 90 degrees',
      'number.max': 'Latitude must be between -90 and 90 degrees',
    }),

    longitude: Joi.number().min(-180).max(180).messages({
      'number.min': 'Longitude must be between -180 and 180 degrees',
      'number.max': 'Longitude must be between -180 and 180 degrees',
    }),

    address: Joi.string().min(5).max(255).messages({
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 255 characters',
    }),

    contactNumber: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .messages({
        'string.pattern.base': 'Contact number must be a valid phone number',
      }),

    contactEmail: Joi.string().email().messages({
      'string.email': 'Contact email must be a valid email address',
    }),

    state: Joi.string().min(2).max(50).messages({
      'string.min': 'State must be at least 2 characters long',
      'string.max': 'State cannot exceed 50 characters',
    }),

    country: Joi.string().min(2).max(50).messages({
      'string.min': 'Country must be at least 2 characters long',
      'string.max': 'Country cannot exceed 50 characters',
    }),

    city: Joi.string().min(2).max(50).messages({
      'string.min': 'City must be at least 2 characters long',
      'string.max': 'City cannot exceed 50 characters',
    }),

    localGovernmentArea: Joi.string().min(2).max(100).messages({
      'string.min': 'Local Government Area must be at least 2 characters long',
      'string.max': 'Local Government Area cannot exceed 100 characters',
    }),

    postalCode: Joi.string()
      .pattern(/^[0-9]{5}(?:-[0-9]{4})?$/)
      .messages({
        'string.pattern.base':
          'Postal code must be a valid format (e.g., 12345 or 12345-6789)',
      }),

    serviceSummary: Joi.string().min(10).max(500).messages({
      'string.min': 'Service summary must be at least 10 characters long',
      'string.max': 'Service summary cannot exceed 500 characters',
    }),

    workHours: Joi.string()
      .pattern(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      )
      .messages({
        'string.pattern.base': 'Work hours must be in the format HH:MM-HH:MM',
      }),
  })

  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })
}



const validateHospitalService = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100).messages({
      'string.empty': 'Service name is required',
      'string.min': 'Service name must be at least 3 characters long',
      'string.max': 'Service name cannot exceed 100 characters',
    }),
    description: Joi.string().required().min(10).max(500).messages({
      'string.empty': 'Service description is required',
      'string.min': 'Service description must be at least 10 characters long',
      'string.max': 'Service description cannot exceed 500 characters',
    }),
    price: Joi.number().required().min(0).messages({
      'number.empty': 'Service price is required',
      'number.min': 'Service price must be a positive number',
    }),
  })

  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })
}

module.exports = {
  validateHospital,
  validateHospitalUpdate,
  validateHospitalService,
}
