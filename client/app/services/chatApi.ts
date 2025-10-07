import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Conversations", "Conversation", "Summary"],
  endpoints: (builder) => ({
    askQuestion: builder.mutation<
      any,
      {
        question: string;
        conversationId?: string;
        format?: "test" | "odi" | "t20" | "all";
      }
    >({
      query: ({ question, conversationId, format }) => ({
        url: "/matches/ask",
        method: "POST",
        body: { question, conversationId, format },
      }),
      invalidatesTags: (result, error, { conversationId }) =>
        conversationId
          ? [{ type: "Conversation", id: conversationId }]
          : [{ type: "Conversations" }],
    }),

    listConversations: builder.query<any[], number | void>({
      query: (limit = 20) => `/matches/history?limit=${limit}`,
      providesTags: ["Conversations"],
    }),

    getConversation: builder.query<any, string>({
      query: (conversationId) => `/matches/history/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Conversation", id: conversationId },
      ],
    }),

    getConversationSummary: builder.query<any, string>({
      query: (conversationId) => `/user/summary/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Summary", id: conversationId },
      ],
    }),
  }),
});

export const {
  useAskQuestionMutation,
  useListConversationsQuery,
  useGetConversationQuery,
  useGetConversationSummaryQuery,
} = chatApi;
