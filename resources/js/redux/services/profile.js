// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.token?.value || '';

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/profile/update',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updateAvatar: builder.mutation({
      query: (body) => ({
        url: '/profile/update/profile-photo',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updatePassword: builder.mutation({
      query: (body) => ({
        url: '/profile/update/password',
        method: 'POST',
        body,
      }),
    }),

    // Checkpoint
    resume: builder.mutation({
      query: (body) => ({
        url: '/profile/checkpoint/resume',
        method: 'POST',
        body,
      }),
    }),
    identification: builder.mutation({
      query: (body) => ({
        url: '/profile/checkpoint/identification',
        method: 'POST',
        body,
      }),
    }),
    companyInformation: builder.mutation({
      query: (body) => ({
        url: '/profile/checkpoint/company-information',
        method: 'POST',
        body,
      }),
    }),
  }),
})

// Export hooks for usage in functional pages, which are
// auto-generated based on the defined endpoints
export const { 
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdatePasswordMutation,

  // Checkpoint
  useResumeMutation,
  useIdentificationMutation,
  useCompanyInformationMutation,
} = profileApi