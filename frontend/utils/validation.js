export const validationRules = {
  userProfile: {
    firstName: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters'
      },
    },
    lastName: {
      required: 'Last name is required',
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters'
      },
    },
    dateOfBirth: {
      required: 'Date of birth is required',
      validate: (value) => {
        if (!value) {
          return 'Date of birth is required'
        }
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          return 'Please enter a valid date'
        }
        return true
      },
    },
    gender: {
      required: 'Gender is required',
    },
  },
  contactInfo: {
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Invalid email address',
      },
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        message: 'Invalid phone number',
      },
    },
    address: {
      required: 'Address is required',
    },
    city: {
      required: 'City is required',
    },
    state: {
      required: 'State is required',
    },
    zipCode: {
      required: 'Zip code is required',
      pattern: {
        value: /^\d{5}(-\d{4})?$/,
        message: 'Invalid zip code',
      },
    },
  },
  employmentInfo: {
    employmentStatus: {
      required: 'Employment status is required',
    },
    companyName: {
      validate: (value, formValues) => {
        if (formValues.employmentStatus === 'Employed' && !value) {
          return 'Company name is required when employed'
        }
        return true
      },
    },
    monthlyIncome: {
      validate: (value) => {
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          return 'Monthly income must be a positive number'
        }
        return true
      },
    },
  },
  financialInfo: {
    loanStatus: {
      required: 'Loan status is required',
    },
    loanAmount: {
      validate: (value, formValues) => {
        if (formValues.loanStatus === 'Yes' && (!value || isNaN(value) || parseFloat(value) <= 0)) {
          return 'Loan amount is required and must be greater than 0'
        }
        return true
      },
    },
    creditScore: {
      validate: (value) => {
        if (value && (isNaN(value) || value < 300 || value > 850)) {
          return 'Credit score must be between 300 and 850'
        }
        return true
      },
    },
  },
  preferences: {
    termsAccepted: {
      validate: (value) => {
        if (!value || value === false) {
          return 'You must accept the terms and conditions'
        }
        return true
      },
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
  confirmPassword: {
    required: 'Please confirm your password',
    validate: (value, formValues) => {
      if (value !== formValues.password) {
        return 'Passwords do not match'
      }
      return true
    },
  },
}

export const getStepValidationRules = (step, watch) => {
  const stepRules = {
    1: validationRules.userProfile,
    2: validationRules.contactInfo,
    3: {
      ...validationRules.employmentInfo,
      companyName: {
        validate: (value) => {
          if (watch('employmentStatus') === 'Employed' && !value) {
            return 'Company name is required when employed'
          }
          return true
        },
      },
    },
    4: {
      ...validationRules.financialInfo,
      loanAmount: {
        validate: (value) => {
          if (watch('loanStatus') === 'Yes' && (!value || isNaN(value) || parseFloat(value) <= 0)) {
            return 'Loan amount is required and must be greater than 0'
          }
          return true
        },
      },
    },
    5: validationRules.preferences,
    6: {
      password: validationRules.password,
      confirmPassword: validationRules.confirmPassword,
    },
  }

  return stepRules[step] || {}
}

