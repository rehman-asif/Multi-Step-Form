'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { getStepRules } from '../../../utils/validation'

export function Step2ContactInfo() {
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.contactInfo,
  })

  const rules = getStepRules(2, watch)

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'contactInfo', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <Input label="Email" type="email" {...register('email', rules.email)} error={errors.email?.message} />
      <Input label="Phone" type="tel" {...register('phone', rules.phone)} error={errors.phone?.message} />
      <Input label="Address" {...register('address', rules.address)} error={errors.address?.message} />

      <div className="flex gap-4">
        <Input label="City" {...register('city', rules.city)} error={errors.city?.message} />
        <Input label="State" {...register('state', rules.state)} error={errors.state?.message} />
      </div>

      <Input label="Zip Code" {...register('zipCode', rules.zipCode)} error={errors.zipCode?.message} />

      <div className="flex justify-between mt-4">
        <button type="button" onClick={() => dispatch(previousStep())} className="px-4 py-2 bg-gray-300 rounded">
          Previous
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Next
        </button>
      </div>

    </form>
  )
}
