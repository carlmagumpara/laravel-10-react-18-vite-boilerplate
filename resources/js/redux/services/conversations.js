// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from 'src/helpers/config';
import Echo from 'src/helpers/echo';
import audio from 'src/assets/message_tone.mp3';

// Define a service using a base URL and expected endpoints
export const conversationApi = createApi({
  reducerPath: 'conversationApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.token?.value || '';

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Accept', 'application/json');

      return headers
    },
  }),
  keepUnusedDataFor: 60,
  tagTypes: ['Conversation', 'Message'],
  endpoints: (builder) => ({    
    getConversations: builder.query({
      query: ({ query }) => `/inbox?q=${query}`,
      providesTags: ['Conversation'],
    }),
    getUnreadConversations: builder.query({
      query: () => `/inbox/unread`,
      providesTags: ['Conversation'],
    }),
    addConversation: builder.mutation({
      query: (body) => ({
        url: `/inbox/create`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation'],
    }),
    getConversation: builder.query({
      query: ({ id }) => `/inbox/show/${id}`,
      providesTags: ['Conversation'],
    }),
    getMessages: builder.query({
      query: ({ id }) => `/inbox/show/${id}?messages=true`,
      providesTags: ['Message'],
      onCacheEntryAdded: async (
        { channel },
        { cacheEntryRemoved, updateCachedData, cacheDataLoaded, getState }
      ) => {
        const token = getState()?.token?.value || '';
        const user = getState()?.user?.value || '';

        try {
          await cacheDataLoaded;
          Echo(token)
          .channel(channel)
          .listen('MessageEvent', message => {
            if (message.data.user_id !== user?.value?.id) {
              new Audio(audio).play();
            }
            updateCachedData((currentCacheData) => {
              currentCacheData.push(message.data);
            });
          });
        } catch (error) {
          console.log(error);
        }
        await cacheEntryRemoved;
        Echo(token).leaveChannel(channel);
        Echo(token).leave(channel);
      }
    }),
    addMessage: builder.mutation({
      query: (body) => ({
        url: `/inbox/send/${body.id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation', 'Message'],
    }),
  }),
})

export const {
  useGetConversationsQuery, 
  useGetUnreadConversationsQuery, 
  useGetConversationQuery,
  useGetMessagesQuery, 
  useAddConversationMutation, 
  useAddMessageMutation,
  util
} = conversationApi
