'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { getStepRules } from '../../../utils/validation'

export function Step3EmploymentInfo() {
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.employmentInfo,
  })

  const rules = getStepRules(3, watch)
  const employmentStatus = watch('employmentStatus')

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'employmentInfo', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Employment Status */}
      <Select
        label="Employment Status"
        {...register('employmentStatus', rules.employmentStatus)}
        error={errors.employmentStatus?.message}
        options={[
          { value: 'Employed', label: 'Employed' },
          { value: 'Unemployed', label: 'Unemployed' },
          { value: 'Self-Employed', label: 'Self-Employed' },
          { value: 'Student', label: 'Student' },
        ]}
      />

      {/* Show company details if employed */}
      {employmentStatus === 'Employed' && (
        <>
          <Input label="Company Name" {...register('companyName', rules.companyName)} error={errors.companyName?.message} />
          <Input label="Job Title" {...register('jobTitle')} />
        </>
      )}

      <Input label="Monthly Income" type="number" step="0.01" {...register('monthlyIncome')} />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => dispatch(previousStep())}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>

    </form>
  )
}
