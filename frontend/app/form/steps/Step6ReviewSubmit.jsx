'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { previousStep, resetForm } from '../../../store/slices/formSlice'
import { useCreateSubmissionMutation, useUpdateSubmissionMutation } from '../../../store/api/formApi'
import { Input } from '../../../components/ui/Input'
import { FileUpload } from '../../../components/ui/FileUpload'
import { getStepValidationRules } from '../../../utils/validation'

export function Step6ReviewSubmit() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { formData, editingId } = useSelector((state) => state.form)
  const [createSubmission, { isLoading: isCreating }] = useCreateSubmissionMutation()
  const [updateSubmission, { isLoading: isUpdating }] = useUpdateSubmissionMutation()
  const [files, setFiles] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (editingId && formData.documents && formData.documents.length > 0) {
      setFiles(formData.documents)
    }
  }, [editingId, formData.documents])

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      password: formData.password || '',
      confirmPassword: formData.confirmPassword || '',
    },
    shouldUnregister: false,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const getValidationRules = () => {
    const baseRules = getStepValidationRules(6, watch)
    if (!editingId) return baseRules

    return {
      password: { ...baseRules.password, required: false },
      confirmPassword: {
        ...baseRules.confirmPassword,
        required: false,
        validate: (value, formValues) => {
          if (!value && !formValues.password) return true
          return value === formValues.password || 'Passwords do not match'
        },
      },
    }
  }

  const validationRules = getValidationRules()

  const onSubmit = async (passwordData) => {
    try {
      setSubmitError(null)
      
      const submissionData = { 
        ...formData,
        password: passwordData.password,
        confirmPassword: passwordData.confirmPassword,
      }
      
      const newFiles = files.filter(file => file instanceof File)
      if (newFiles.length > 0) {
        submissionData.documents = newFiles
      } else if (!editingId) {
        submissionData.documents = []
      }
      
      if (editingId) {
        if (!submissionData.password) {
          delete submissionData.password
          delete submissionData.confirmPassword
        }
        if (newFiles.length === 0) {
          delete submissionData.documents
        }
      }

      if (editingId) {
        await updateSubmission({ id: editingId, formData: submissionData }).unwrap()
        router.push('/list?success=updated')
      } else {
        await createSubmission(submissionData).unwrap()
        router.push('/list?success=created')
      }
      
      dispatch(resetForm())
    } catch (error) {
      const errorMessage = error?.data?.message 
        || error?.data?.errors?.[0]?.msg 
        || error?.message 
        || 'Failed to submit form. Please try again.'
      setSubmitError(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span>{' '}
            {formData.userProfile.firstName} {formData.userProfile.lastName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {formData.contactInfo.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {formData.contactInfo.phone}
          </div>
          <div>
            <span className="font-medium">Employment:</span>{' '}
            {formData.employmentInfo.employmentStatus}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={editingId ? 'Password (Leave blank to keep current password)' : 'Password'}
          type="password"
          {...register('password', validationRules.password)}
          error={errors.password?.message}
        />

        <Input
          label={editingId ? 'Confirm Password (Leave blank to keep current password)' : 'Confirm Password'}
          type="password"
          {...register('confirmPassword', validationRules.confirmPassword)}
          error={errors.confirmPassword?.message}
        />

        <FileUpload
          label="Upload Documents (Optional)"
          files={files}
          onChange={setFiles}
          maxFiles={5}
        />

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {submitError}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => dispatch(previousStep())}
            className="btn-secondary"
            disabled={isLoading}
          >
            Previous
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

