// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const stylistPositionApi = createApi({
  reducerPath: 'stylistPositionApi',
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
  tagTypes: ['Stylist Position'],
  endpoints: (builder) => ({
    getStylistPositions: builder.query({
      query: ({ search = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/stylist-positions?search=${search}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Stylist Position'],
    }),
    addStylistPosition: builder.mutation({
      query: (body) => ({
        url: `/stylist-positions/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stylist Position'],
    }),
    deleteStylistPosition: builder.mutation({
      query: (body) => ({
        url: `/stylist-positions/delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stylist Position'],
    }),
    updateStylistPosition: builder.mutation({
      query: (body) => ({
        url: `/stylist-positions/update/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['Stylist Position'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetStylistPositionsQuery,
  useAddStylistPositionMutation,
  useDeleteStylistPositionMutation,
  useUpdateStylistPositionMutation,
} = stylistPositionApi