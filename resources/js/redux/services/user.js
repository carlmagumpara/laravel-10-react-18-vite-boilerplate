// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ role_id, search = '', page = 1, per_page = 10 }) => `/users/role/${role_id}?search=${search}&page=${page}&per_page=${per_page}`,
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: `/users/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `/users/update/${body.id}`,
        method: 'POST',
        body: body.data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (body) => ({
        url: '/users/delete',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['User'],
    }),
    approveCredentials: builder.mutation({
      query: (body) => ({
        url: '/users/credentials/approve',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    declineCredentials: builder.mutation({
      query: (body) => ({
        url: '/users/credentials/decline',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    getEmployeeRanking: builder.query({
      query: ({ search = '', page = 1, per_page = 10 }) => `/users/ranking/employee?search=${search}&page=${page}&per_page=${per_page}`,
      providesTags: ['Ranking'],
    }),
    getEmployerRanking: builder.query({
      query: ({ search = '', page = 1, per_page = 10 }) => `/users/ranking/employer?search=${search}&page=${page}&per_page=${per_page}`,
      providesTags: ['Ranking'],
    }),
  }),
})

// Export hooks for usage in functional pages, which are
// auto-generated based on the defined endpoints
export const { 
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useApproveCredentialsMutation,
  useDeclineCredentialsMutation,
  useGetEmployeeRankingQuery,
  useGetEmployerRankingQuery,
} = userApi