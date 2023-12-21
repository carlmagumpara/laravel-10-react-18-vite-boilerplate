// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const appointmentApi = createApi({
  reducerPath: 'appointmentApi',
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
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: ({ search = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/appointments?search=${search}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Appointment'],
    }),
    getAppointmentServices: builder.query({
      query: ({ type = '', stylist_id = '', start_date = '', end_date = '', search = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/appointments/services?type=${type}&stylist_id=${stylist_id}&start_date=${start_date}&end_date=${end_date}&search=${search}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Appointment'],
    }),
    addAppointment: builder.mutation({
      query: (body) => ({
        url: `/appointments/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    deleteAppointment: builder.mutation({
      query: (body) => ({
        url: `/appointments/delete`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
    updateAppointment: builder.mutation({
      query: (body) => ({
        url: `/appointments/update/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['Appointment'],
    }),
    updateServicesAndSchedule: builder.mutation({
      query: (body) => ({
        url: `/appointments/update-services-and-schedule/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['Appointment'],
    }),
    availabilityChecker: builder.mutation({
      query: (body) => ({
        url: '/appointments/availability-checker',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointment'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetAppointmentsQuery,
  useGetAppointmentServicesQuery,
  useAddAppointmentMutation,
  useDeleteAppointmentMutation,
  useAvailabilityCheckerMutation,
  useUpdateAppointmentMutation,
  useUpdateServicesAndScheduleMutation,
} = appointmentApi