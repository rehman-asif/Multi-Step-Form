'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { previousStep, resetForm } from '../../../store/slices/formSlice'
import { useCreateSubmissionMutation, useUpdateSubmissionMutation } from '../../../store/api/formApi'
import { Input } from '../../../components/ui/Input'
import { FileUpload } from '../../../components/ui/FileUpload'

export function Step6ReviewSubmit() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { formData, editingId } = useSelector(state => state.form)

  const [files, setFiles] = useState(formData.documents || [])
  const [submitError, setSubmitError] = useState(null)

  const [createSubmission, { isLoading: isCreating }] = useCreateSubmissionMutation()
  const [updateSubmission, { isLoading: isUpdating }] = useUpdateSubmissionMutation()
  const isLoading = isCreating || isUpdating

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      setSubmitError(null)

      // Merge form data with password if provided
      const submissionData = { ...formData }
      if (password) submissionData.password = password
      if (password) submissionData.confirmPassword = confirmPassword

      // Include new files only
      const newFiles = files.filter(file => file instanceof File)
      if (newFiles.length) submissionData.documents = newFiles

      if (editingId) {
        await updateSubmission({ id: editingId, formData: submissionData }).unwrap()
        router.push('/list?success=updated')
      } else {
        await createSubmission(submissionData).unwrap()
        router.push('/list?success=created')
      }

      dispatch(resetForm())
    } catch (error) {
      setSubmitError(error?.data?.message || error?.message || 'Failed to submit form')
    }
  }

  const passwordsMatch = (value) => {
    return value === watch('password') || 'Passwords do not match'
  }

  return (
    <div className="space-y-6">

      {/* Review Info */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Name:</span> {formData.userProfile.firstName} {formData.userProfile.lastName}</div>
          <div><span className="font-medium">Email:</span> {formData.contactInfo.email}</div>
          <div><span className="font-medium">Phone:</span> {formData.contactInfo.phone}</div>
          <div><span className="font-medium">Employment:</span> {formData.employmentInfo.employmentStatus}</div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <Input
          label={editingId ? 'Password (Leave blank to keep current)' : 'Password'}
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          label={editingId ? 'Confirm Password' : 'Confirm Password'}
          type="password"
          {...register('confirmPassword', { validate: passwordsMatch })}
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

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => dispatch(previousStep())}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={isLoading}
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}
