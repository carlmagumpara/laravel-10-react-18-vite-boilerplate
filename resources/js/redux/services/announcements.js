// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const announcementApi = createApi({
  reducerPath: 'announcementApi',
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
  tagTypes: ['Announcement'],
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: ({ search = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/announcements?search=${search}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Announcement'],
    }),
    addAnnouncement: builder.mutation({
      query: (body) => ({
        url: `/announcements/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Announcement'],
    }),
    deleteAnnouncement: builder.mutation({
      query: (body) => ({
        url: `/announcements/delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Announcement'],
    }),
    updateAnnouncement: builder.mutation({
      query: (body) => ({
        url: `/announcements/update/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['Announcement'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetAnnouncementsQuery,
  useAddAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementMutation,
} = announcementApi