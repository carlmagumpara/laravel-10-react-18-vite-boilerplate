// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const loginApi = createApi({
  reducerPath: 'loginApi',
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
  tagTypes: [],
  endpoints: (builder) => ({    
    login: builder.mutation({
      query: (body) => ({
        url: `/login`,
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/forgot-password`,
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `/reset-password`,
        method: 'POST',
        body,
      }),
    }),
  }),
})

// Export hooks for usage in functional pages, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = loginApi