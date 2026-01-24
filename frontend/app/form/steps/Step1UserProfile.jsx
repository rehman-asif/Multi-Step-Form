'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { getStepRules } from '../../../utils/validation'

export function Step1UserProfile() {
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.userProfile,
  })

  const rules = getStepRules(1, watch)

  const onSubmit = (data) => {
    // Save data in Redux and move to next step
    dispatch(updateFormData({ step: 'userProfile', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <Input
        label="First Name"
        {...register('firstName', rules.firstName)}
        error={errors.firstName?.message}
      />

      {/* Last Name */}
      <Input
        label="Last Name"
        {...register('lastName', rules.lastName)}
        error={errors.lastName?.message}
      />

      {/* Date of Birth */}
      <Input
        label="Date of Birth"
        type="date"
        {...register('dateOfBirth', rules.dateOfBirth)}
        error={errors.dateOfBirth?.message}
      />

      {/* Gender */}
      <div>
        <label>Gender</label>
        <div className="flex gap-4 mt-1">
          {['Male', 'Female', 'Other'].map(gender => (
            <label key={gender} className="flex items-center">
              <input
                type="radio"
                value={gender}
                {...register('gender', rules.gender)}
                className="mr-2"
              />
              {gender}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      </div>

      {/* Submit Button */}
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Next
      </button>

    </form>
  )
}
