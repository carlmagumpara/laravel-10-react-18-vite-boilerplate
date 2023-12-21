// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const registerApi = createApi({
  reducerPath: 'registerApi',
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
    register: builder.mutation({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
    }),
    sendOTPCode: builder.mutation({
      query: (body) => ({
        url: '/register/send-otp-code',
        method: 'POST',
        body,
      }),
    }),
    verifyOTPCode: builder.mutation({
      query: (body) => ({
        url: '/register/verify-otp-code',
        method: 'POST',
        body,
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useRegisterMutation,
  useSendOTPCodeMutation,
  useVerifyOTPCodeMutation,
} = registerApi