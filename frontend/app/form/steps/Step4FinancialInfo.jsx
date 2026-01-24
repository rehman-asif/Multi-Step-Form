'use client'

import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormData, nextStep, previousStep } from '../../../store/slices/formSlice'
import { Input } from '../../../components/ui/Input'
import { getStepRules } from '../../../utils/validation'

export function Step4FinancialInfo() {
  const dispatch = useDispatch()
  const formData = useSelector(state => state.form.formData)

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: formData.financialInfo,
  })

  const rules = getStepRules(4, watch)
  const loanStatus = watch('loanStatus')

  const onSubmit = (data) => {
    dispatch(updateFormData({ step: 'financialInfo', data }))
    dispatch(nextStep())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Loan Status */}
      <div>
        <label>Do you have any existing loans?</label>
        <div className="flex gap-4 mt-1">
          {['Yes', 'No'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                value={option}
                {...register('loanStatus', rules.loanStatus)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.loanStatus && <p className="text-red-500 text-sm">{errors.loanStatus.message}</p>}
      </div>

      {/* Loan Amount if Yes */}
      {loanStatus === 'Yes' && (
        <Input
          label="Loan Amount"
          type="number"
          step="0.01"
          {...register('loanAmount', rules.loanAmount)}
          error={errors.loanAmount?.message}
        />
      )}

      {/* Optional Fields */}
      <Input
        label="Credit Score (Optional)"
        type="number"
        min="300"
        max="850"
        {...register('creditScore', rules.creditScore)}
        error={errors.creditScore?.message}
      />
      <Input
        label="Bank Name (Optional)"
        {...register('bankName')}
      />

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
