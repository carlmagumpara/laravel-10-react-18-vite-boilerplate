// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const notificationApi = createApi({
  reducerPath: 'notificationApi',
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
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, per_page = 10 }) => `/notifications?page=${page}&per_page=${per_page}`,
    }),
    getNotificationCount: builder.query({
      query: () => `/notifications/count`,
      providesTags: ['Notification'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetNotificationsQuery, 
  useGetNotificationCountQuery,
} = notificationApi