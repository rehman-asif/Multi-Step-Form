'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Select } from '../../../components/ui/Select'

export function Step5Preferences() {
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.formData)

  // React Hook Form setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formData.preferences || {},
  })

  // Submit handler
  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'preferences', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Simple Checkboxes */}
      <Checkbox label="Subscribe to newsletter" {...register('newsletter')} />
      <Checkbox label="Enable notifications" {...register('notifications')} />

      {/* Communication Method */}
      <Select
        label="Preferred Communication Method"
        {...register('communicationMethod')}
        options={[
          { value: 'Email', label: 'Email' },
          { value: 'Phone', label: 'Phone' },
          { value: 'SMS', label: 'SMS' },
        ]}
      />

      {/* Terms */}
      <Checkbox
        label="I accept the terms and conditions"
        {...register('termsAccepted', { required: 'You must accept terms' })}
        error={errors.termsAccepted?.message}
      />

      {/* Navigation */}
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
