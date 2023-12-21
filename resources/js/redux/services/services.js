// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const serviceApi = createApi({
  reducerPath: 'serviceApi',
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
  tagTypes: ['Service'],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: ({ search = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/services?search=${search}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Service'],
    }),
    addService: builder.mutation({
      query: (body) => ({
        url: `/services/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation({
      query: (body) => ({
        url: `/services/delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation({
      query: (body) => ({
        url: `/services/update/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['Service'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetServicesQuery,
  useAddServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} = serviceApi