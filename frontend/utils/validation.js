export const stepRules = {
  1: {
    firstName: { required: 'First name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } },
    lastName: { required: 'Last name is required', minLength: { value: 2, message: 'Must be at least 2 characters' } },
    dateOfBirth: { required: 'Date of birth is required' },
    gender: { required: 'Gender is required' },
  },
  2: {
    email: { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } },
    phone: { required: 'Phone is required' },
    address: { required: 'Address is required' },
    city: { required: 'City is required' },
    state: { required: 'State is required' },
    zipCode: { required: 'Zip code is required', pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Invalid zip code' } },
  },
  3: {
    employmentStatus: { required: 'Employment status is required' },
    companyName: {
      validate: (value, formValues) => {
        if (formValues.employmentStatus === 'Employed' && !value?.trim()) {
          return 'Company name is required when employed'
        }
        return true
      },
    },
  },
  4: {
    loanStatus: { required: 'Loan status is required' },
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
  5: {
    termsAccepted: {
      validate: (value) => value === true || 'You must accept the terms',
    },
  },
  6: {
    password: { required: 'Password is required', minLength: { value: 6, message: 'Must be at least 6 characters' } },
    confirmPassword: {
      required: 'Please confirm your password',
      validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
    },
  },
}

export function getStepRules(step, watch) {
  const rules = stepRules[step] || {}
  
  if (step === 3) {
    return {
      ...rules,
      companyName: {
        validate: (value) => {
          if (watch('employmentStatus') === 'Employed' && !value?.trim()) {
            return 'Company name is required when employed'
          }
          return true
        },
      },
    }
  }
  
  if (step === 4) {
    return {
      ...rules,
      loanAmount: {
        validate: (value) => {
          if (watch('loanStatus') === 'Yes' && (!value || isNaN(value) || parseFloat(value) <= 0)) {
            return 'Loan amount is required and must be greater than 0'
          }
          return true
        },
      },
    }
  }
  
  return rules
}
