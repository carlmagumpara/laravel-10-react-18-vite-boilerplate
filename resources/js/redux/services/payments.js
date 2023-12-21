// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const paymentApi = createApi({
  reducerPath: 'paymentApi',
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
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ search = '', page = 1, per_page = 10 }) => `/payments?search=${search}&page=${page}&per_page=${per_page}`,
      providesTags: ['Payment'],
    }),
  }),
})

// Export hooks for usage in functional pages, which are
// auto-generated based on the defined endpoints
export const { 
  useGetPaymentsQuery,
} = paymentApi