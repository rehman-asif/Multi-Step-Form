'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetAllSubmissionsQuery, useDeleteSubmissionMutation } from '../../store/api/formApi'
import { useDispatch } from 'react-redux'
import { loadFormData, setCurrentStep, setEditingId } from '../../store/slices/formSlice'
import { Toast } from '../../components/Toast'

const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : ''

export default function ListPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const { data, isLoading, error, refetch } = useGetAllSubmissionsQuery({ page, limit: 10 })
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteSubmissionMutation()

  // Show toast if redirected from submission
  useEffect(() => {
    const success = new URLSearchParams(window.location.search).get('success')
    if (success) {
      setToast({ 
        message: success === 'created' ? 'Form submitted successfully!' : 'Form updated successfully!', 
        type: 'success' 
      })
      window.history.replaceState({}, '', '/list')
    }
  }, [])

  // Edit submission
  const handleEdit = (submission) => {
    dispatch(loadFormData({
      userProfile: { ...submission.userProfile, dateOfBirth: formatDate(submission.userProfile.dateOfBirth) },
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

  // Delete submission
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSubmission(deleteId).unwrap()
      setDeleteId(null)
      setToast({ message: 'Submission deleted successfully', type: 'success' })
      refetch()
    } catch {
      setToast({ message: 'Failed to delete submission', type: 'error' })
    }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Error loading submissions</div>

  const submissions = data?.submissions || []
  const pagination = data?.pagination

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
          <button onClick={() => router.push('/form')} className="btn-primary">New Submission</button>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No submissions found</p>
            <button onClick={() => router.push('/form')} className="btn-primary mt-4">Create First Submission</button>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map(s => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{s.userProfile.firstName} {s.userProfile.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.contactInfo.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.employmentInfo.employmentStatus}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button onClick={() => handleEdit(s)} className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                        <button onClick={() => setDeleteId(s._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-50">Previous</button>
                <span className="text-gray-700">Page {pagination.page} of {pagination.pages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this submission? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setDeleteId(null)} className="btn-secondary" disabled={isDeleting}>Cancel</button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50" disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
