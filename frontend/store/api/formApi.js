import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { buildFormData } from '../../utils/formDataBuilder'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
})

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery,
  tagTypes: ['FormSubmission'],
  endpoints: (builder) => ({
    createSubmission: builder.mutation({
      query: (formData) => ({
        url: '/forms',
        method: 'POST',
        body: buildFormData(formData),
      }),
      invalidatesTags: ['FormSubmission'],
    }),
    getAllSubmissions: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/forms',
        params: { page, limit },
      }),
      providesTags: ['FormSubmission'],
    }),
    getSubmissionById: builder.query({
      query: (id) => `/forms/${id}`,
      providesTags: (result, error, id) => [{ type: 'FormSubmission', id }],
    }),
    updateSubmission: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/forms/${id}`,
        method: 'PUT',
        body: buildFormData(formData),
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'FormSubmission', id },
        'FormSubmission',
      ],
    }),
    deleteSubmission: builder.mutation({
      query: (id) => ({
        url: `/forms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FormSubmission'],
    }),
  }),
})

export const {
  useCreateSubmissionMutation,
  useGetAllSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
} = formApi

