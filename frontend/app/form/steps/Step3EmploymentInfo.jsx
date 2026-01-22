'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { getStepValidationRules } from '../../../utils/validation'

export function Step3EmploymentInfo() {
  const dispatch = useDispatch()
  const formData = useSelector((state) => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.employmentInfo,
    shouldUnregister: false,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const employmentStatus = watch('employmentStatus')
  const validationRules = getStepValidationRules(3, watch)

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'employmentInfo', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Employment Status"
        {...register('employmentStatus', validationRules.employmentStatus)}
        error={errors.employmentStatus?.message}
        options={[
          { value: 'Employed', label: 'Employed' },
          { value: 'Unemployed', label: 'Unemployed' },
          { value: 'Self-Employed', label: 'Self-Employed' },
          { value: 'Student', label: 'Student' },
        ]}
      />

      {employmentStatus === 'Employed' && (
        <>
          <Input
            label="Company Name"
            {...register('companyName', validationRules.companyName)}
            error={errors.companyName?.message}
          />

          <Input
            label="Job Title"
            {...register('jobTitle')}
          />
        </>
      )}

      <Input
        label="Monthly Income"
        type="number"
        step="0.01"
        {...register('monthlyIncome', validationRules.monthlyIncome)}
        error={errors.monthlyIncome?.message}
      />

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => dispatch(previousStep())}
          className="btn-secondary"
        >
          Previous
        </button>
        <button type="submit" className="btn-primary">
          Next
        </button>
      </div>
    </form>
  )
}

