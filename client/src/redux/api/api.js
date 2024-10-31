import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "./../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my-chats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUsers: builder.query({
      query: (username) => ({
        url: `user/search?username=${username}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/send-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "user/get-notification",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/accept-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    getChatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) {
          url += "?populate=true";
        }

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    getMyMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    getMyFriendDetails: builder.query({
      query: ({ chatId }) => ({
        url: `chat/get-friend-details/${chatId}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/attachment",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    getMyGroups: builder.query({
      query: () => ({
        url: `chat/my-groups`,
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    getAvailableFriends: builder.query({
      query: (chatId) => {
        let url = `user/friends`;
        if (chatId) url += `?chatId=${chatId}`;
        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new-group",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),
    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),
    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `chat/remove-member`,
        method: "DELETE",
        credentials: "include",
        body: { userId, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),
    addGroupMembers: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chat/add-members`,
        method: "PUT",
        credentials: "include",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),
    addGroupAdmin: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chat/add-group-admin`,
        method: "PATCH",
        credentials: "include",
        body: { members, chatId },
      }),
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
    updateBio: builder.mutation({
      query: (data) => ({
        url: `user/update-bio`,
        credentials: "include",
        method: "PATCH",
        body: data,
      }),
    }),
    updateDetails: builder.mutation({
      query: (data) => ({
        url: `user/update-details`,
        credentials: "include",
        method: "PATCH",
        body: data,
      }),
    }),
    getUserDetails: builder.query({
      query: ({ userId }) => ({
        url: `admin/user-details/${userId}`,
        credentials: "include",
      }),
    }),
    getGroupChatDetails: builder.query({
      query: ({ chatId }) => ({
        url: `admin/chat-details/${chatId}`,
        credentials: "include",
      }),
    }),
    deleteOrRenameGroupAvatar: builder.mutation({
      query: (data) => {
        return {
          url: `chat/group-avatar`,
          method: "PATCH",
          credentials: "include",
          body: data,
        };
      },
      invalidatesTags: ["Chat"],
    }),
    deleteOrRenameUserAvatar: builder.mutation({
      query: (data) => {
        return {
          url: `user/user-avatar`,
          method: "PATCH",
          credentials: "include",
          body: data,
        };
      },
      invalidatesTags: ["Chat"],
    }),
  }),
});
export default api;

export const {
  useMyChatsQuery,
  useLazySearchUsersQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useAcceptFriendRequestMutation,
  useGetChatDetailsQuery,
  useGetMyMessagesQuery,

  useGetMyFriendDetailsQuery,
  useSendAttachmentsMutation,
  useGetMyGroupsQuery,
  useGetAvailableFriendsQuery,

  useNewGroupMutation,

  useRenameGroupMutation,

  useRemoveGroupMemberMutation,

  useAddGroupMembersMutation,

  useAddGroupAdminMutation,

  useDeleteChatMutation,

  useLeaveGroupMutation,

  useUpdateBioMutation,

  useUpdateDetailsMutation,

  useGetUserDetailsQuery,
  useGetGroupChatDetailsQuery,
  useDeleteOrRenameGroupAvatarMutation,

  useDeleteOrRenameUserAvatarMutation,
} = api;
