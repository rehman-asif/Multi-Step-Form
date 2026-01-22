'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { getStepValidationRules } from '../../../utils/validation'

export function Step1UserProfile() {
  const dispatch = useDispatch()
  const formData = useSelector((state) => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.userProfile,
    shouldUnregister: false,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const validationRules = getStepValidationRules(1, watch)

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'userProfile', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="First Name"
        {...register('firstName', validationRules.firstName)}
        error={errors.firstName?.message}
      />

      <Input
        label="Last Name"
        {...register('lastName', validationRules.lastName)}
        error={errors.lastName?.message}
      />

      <Input
        label="Date of Birth"
        type="date"
        {...register('dateOfBirth', validationRules.dateOfBirth)}
        error={errors.dateOfBirth?.message}
      />

      <div className="mb-4">
        <label className="label-field">Gender</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {['Male', 'Female', 'Other'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="radio"
                value={option}
                {...register('gender', validationRules.gender)}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        {errors.gender && <p className="error-text">{errors.gender.message}</p>}
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" className="btn-primary">
          Next
        </button>
      </div>
    </form>
  )
}

