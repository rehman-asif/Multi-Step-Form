import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentStep: 1,
  totalSteps: 6,
  formData: {
    userProfile: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
    },
    contactInfo: {
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    employmentInfo: {
      employmentStatus: '',
      companyName: '',
      jobTitle: '',
      monthlyIncome: '',
    },
    financialInfo: {
      loanStatus: '',
      loanAmount: '',
      creditScore: '',
      bankName: '',
    },
    preferences: {
      newsletter: false,
      notifications: false,
      communicationMethod: 'Email',
      termsAccepted: false,
    },
    documents: [],
    password: '',
    confirmPassword: '',
  },
  editingId: null,
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    updateFormData: (state, action) => {
      const { step, data } = action.payload
      state.formData[step] = { ...state.formData[step], ...data }
    },
    resetForm: (state) => {
      state.currentStep = 1
      state.formData = initialState.formData
      state.editingId = null
    },
    loadFormData: (state, action) => {
      state.formData = { ...initialState.formData, ...action.payload }
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload
    },
  },
})

export const {
  setCurrentStep,
  updateFormData,
  resetForm,
  loadFormData,
  nextStep,
  previousStep,
  setEditingId,
} = formSlice.actions

export default formSlice.reducer

