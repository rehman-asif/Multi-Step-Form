'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { getStepValidationRules } from '../../../utils/validation'

export function Step2ContactInfo() {
  const dispatch = useDispatch()
  const formData = useSelector((state) => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.contactInfo,
    shouldUnregister: false,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const validationRules = getStepValidationRules(2, watch)

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'contactInfo', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register('email', validationRules.email)}
        error={errors.email?.message}
      />

      <Input
        label="Phone Number"
        type="tel"
        {...register('phone', validationRules.phone)}
        error={errors.phone?.message}
      />

      <Input
        label="Address"
        {...register('address', validationRules.address)}
        error={errors.address?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          {...register('city', validationRules.city)}
          error={errors.city?.message}
        />

        <Input
          label="State"
          {...register('state', validationRules.state)}
          error={errors.state?.message}
        />
      </div>

      <Input
        label="Zip Code"
        {...register('zipCode', validationRules.zipCode)}
        error={errors.zipCode?.message}
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

