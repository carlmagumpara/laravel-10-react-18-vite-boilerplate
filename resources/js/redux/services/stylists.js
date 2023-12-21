// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const stylistApi = createApi({
  reducerPath: 'stylistApi',
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
  tagTypes: ['Stylist'],
  endpoints: (builder) => ({
    getStylists: builder.query({
      query: ({ search = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/stylists?search=${search}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Stylist'],
    }),
    addStylist: builder.mutation({
      query: (body) => ({
        url: `/stylists/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stylist'],
    }),
    deleteStylist: builder.mutation({
      query: (body) => ({
        url: `/stylists/delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stylist'],
    }),
    updateStylist: builder.mutation({
      query: (body) => ({
        url: `/stylists/update/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['Stylist'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetStylistsQuery,
  useAddStylistMutation,
  useDeleteStylistMutation,
  useUpdateStylistMutation,
} = stylistApi