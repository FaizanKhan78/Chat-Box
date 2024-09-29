import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromLocalStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/event";

const initialState = {
  notificationsCount: 0,
  newMessagesAlert: getOrSaveFromLocalStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotificationsCount: (state) => {
      state.notificationsCount += 1;
    },
    decrementNotificationsCount: (state) => {
      state.notificationsCount -= 1;
    },
    resetNotificationsCount: (state) => {
      state.notificationsCount = 0;
    },
    setNewMessageAlert: (state, action) => {
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === action.payload.chatId
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId: action.payload.chatId,
          count: 1,
        });
      }
    },
    removeNewMessageAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (message) => message.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;
export const {
  incrementNotificationsCount,
  decrementNotificationsCount,
  setNewMessageAlert,
  removeNewMessageAlert,
} = chatSlice.actions;
