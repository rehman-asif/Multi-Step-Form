'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { getStepValidationRules } from '../../../utils/validation'

export function Step4FinancialInfo() {
  const dispatch = useDispatch()
  const formData = useSelector((state) => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.financialInfo,
    shouldUnregister: false,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const loanStatus = watch('loanStatus')
  const validationRules = getStepValidationRules(4, watch)

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'financialInfo', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-4">
        <label className="label-field">Do you have any existing loans?</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="radio"
                value={option}
                {...register('loanStatus', validationRules.loanStatus)}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        {errors.loanStatus && <p className="error-text">{errors.loanStatus.message}</p>}
      </div>

      {loanStatus === 'Yes' && (
        <Input
          label="Loan Amount"
          type="number"
          step="0.01"
          {...register('loanAmount', validationRules.loanAmount)}
          error={errors.loanAmount?.message}
        />
      )}

      <Input
        label="Credit Score (Optional)"
        type="number"
        min="300"
        max="850"
        {...register('creditScore', validationRules.creditScore)}
        error={errors.creditScore?.message}
      />

      <Input
        label="Bank Name (Optional)"
        {...register('bankName')}
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

