'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Checkbox } from '../../../components/ui/Checkbox'
import { Select } from '../../../components/ui/Select'
import { getStepValidationRules } from '../../../utils/validation'

export function Step5Preferences() {
  const dispatch = useDispatch()
  const formData = useSelector((state) => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.preferences,
    shouldUnregister: false,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const validationRules = getStepValidationRules(5, watch)

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'preferences', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Checkbox
        label="Subscribe to newsletter"
        {...register('newsletter')}
      />

      <Checkbox
        label="Enable notifications"
        {...register('notifications')}
      />

      <Select
        label="Preferred Communication Method"
        {...register('communicationMethod')}
        options={[
          { value: 'Email', label: 'Email' },
          { value: 'Phone', label: 'Phone' },
          { value: 'SMS', label: 'SMS' },
        ]}
      />

      <Checkbox
        label="I accept the terms and conditions"
        {...register('termsAccepted', validationRules.termsAccepted)}
        error={errors.termsAccepted?.message}
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

