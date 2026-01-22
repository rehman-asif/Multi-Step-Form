'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllSubmissionsQuery, useDeleteSubmissionMutation } from '../../store/api/formApi'
import { useDispatch } from 'react-redux'
import { loadFormData, setCurrentStep, setEditingId } from '../../store/slices/formSlice'
import { Toast } from '../../components/Toast'

export default function ListPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState(null)
  
  const { data, isLoading, error, refetch } = useGetAllSubmissionsQuery({ page, limit: 10 })
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteSubmissionMutation()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    if (success) {
      const message = success === 'created' ? 'Form submitted successfully!' : 'Form updated successfully!'
      setToast({ message, type: 'success' })
      window.history.replaceState({}, '', '/list')
    }
  }, [])

  const handleEdit = (submission) => {
    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    dispatch(loadFormData({
      userProfile: {
        ...submission.userProfile,
        dateOfBirth: formatDate(submission.userProfile.dateOfBirth)
      },
      contactInfo: submission.contactInfo,
      employmentInfo: submission.employmentInfo,
      financialInfo: submission.financialInfo,
      preferences: submission.preferences,
      documents: submission.documents || [],
      password: '',
      confirmPassword: '',
    }))
    dispatch(setEditingId(submission._id))
    dispatch(setCurrentStep(1))
    router.push('/form')
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await deleteSubmission(deleteId).unwrap()
        setShowDeleteModal(false)
        setDeleteId(null)
        setToast({ message: 'Submission deleted successfully', type: 'success' })
        refetch()
      } catch (error) {
        setToast({ message: 'Failed to delete submission', type: 'error' })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading submissions</div>
      </div>
    )
  }

  const submissions = data?.submissions || []
  const pagination = data?.pagination

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
            <button
              onClick={() => router.push('/form')}
              className="btn-primary"
            >
              New Submission
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No submissions found</p>
              <button
                onClick={() => router.push('/form')}
                className="btn-primary mt-4"
              >
                Create First Submission
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.userProfile.firstName} {submission.userProfile.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.contactInfo.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.employmentInfo.employmentStatus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(submission)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(submission._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteId(null)
                }}
                className="btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

