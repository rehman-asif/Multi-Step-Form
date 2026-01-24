import Joi from 'joi';

const baseFormSchema = Joi.object({
  userProfile: Joi.object({
    firstName: Joi.string().trim().required().messages({
      'any.required': 'First name is required',
      'string.empty': 'First name is required',
    }),
    lastName: Joi.string().trim().required().messages({
      'any.required': 'Last name is required',
      'string.empty': 'Last name is required',
    }),
    dateOfBirth: Joi.date().iso().required().messages({
      'any.required': 'Date of birth is required',
      'date.base': 'Enter a valid date',
    }),
    gender: Joi.string().valid('Male', 'Female', 'Other').required().messages({
      'any.only': 'Select a valid gender',
      'any.required': 'Gender is required',
    }),
  }).required(),

  contactInfo: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Enter a valid email',
      'any.required': 'Email is required',
    }),
    phone: Joi.string().trim().required().messages({
      'any.required': 'Phone is required',
      'string.empty': 'Phone is required',
    }),
    address: Joi.string().trim().required().messages({
      'any.required': 'Address is required',
    }),
    city: Joi.string().trim().required().messages({
      'any.required': 'City is required',
    }),
    state: Joi.string().trim().required().messages({
      'any.required': 'State is required',
    }),
    zipCode: Joi.string().trim().required().messages({
      'any.required': 'Zip code is required',
    }),
  }).required(),

  employmentInfo: Joi.object({
    employmentStatus: Joi.string()
      .valid('Employed', 'Unemployed', 'Self-Employed', 'Student')
      .required()
      .messages({
        'any.only': 'Select a valid employment status',
        'any.required': 'Employment status is required',
      }),
    companyName: Joi.string().trim().when('employmentStatus', {
      is: 'Employed',
      then: Joi.required().messages({
        'any.required': 'Company name is required when employed',
      }),
      otherwise: Joi.optional().allow(''),
    }),
    jobTitle: Joi.string().trim().optional().allow(''),
    monthlyIncome: Joi.number().optional().allow(null, ''),
  }).required(),

  financialInfo: Joi.object({
    loanStatus: Joi.string().valid('Yes', 'No').required().messages({
      'any.only': 'Loan status is required',
      'any.required': 'Loan status is required',
    }),
    loanAmount: Joi.number().when('loanStatus', {
      is: 'Yes',
      then: Joi.number().min(1).required().messages({
        'number.base': 'Loan amount must be a number',
        'number.min': 'Loan amount must be greater than 0',
        'any.required': 'Loan amount is required when loan status is Yes',
      }),
      otherwise: Joi.optional().allow(null, 0, ''),
    }),
    creditScore: Joi.number().integer().min(300).max(850).optional().allow(null, '').messages({
      'number.min': 'Credit score must be at least 300',
      'number.max': 'Credit score must be at most 850',
    }),
    bankName: Joi.string().trim().optional().allow(''),
  }).required(),

  preferences: Joi.object({
    newsletter: Joi.boolean().default(false),
    notifications: Joi.boolean().default(false),
    communicationMethod: Joi.string().valid('Email', 'Phone', 'SMS').default('Email'),
    termsAccepted: Joi.boolean().valid(true).required().messages({
      'any.only': 'You must accept the terms',
      'any.required': 'Terms must be accepted',
    }),
  }).required(),
});

const createFormSchema = baseFormSchema.keys({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm password is required',
  }),
});

const updateFormSchema = baseFormSchema.keys({
  password: Joi.string().min(6).optional().allow('').messages({
    'string.min': 'Password must be at least 6 characters',
  }),
  confirmPassword: Joi.any()
    .when('password', {
      is: Joi.exist(),
      then: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Confirm password is required when password is provided',
      }),
      otherwise: Joi.optional().allow(''),
    }),
});

export const validateForm = (req, res, next) => {
  const schema = req.method === 'PUT' ? updateFormSchema : createFormSchema;

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((d) => ({
      field: d.path.join('.'),
      msg: d.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = value;
  next();
};
