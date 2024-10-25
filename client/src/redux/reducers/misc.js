import { createSlice } from "@reduxjs/toolkit";

// Initial state for misc UI features
const initialState = {
  isNewGroup: false,
  isAddMember: false,
  isAddGroupAdmin: false,
  isNotification: false,
  isMobile: false,
  isSearch: false,
  isFileMenu: false,
  isChatMenu: false,
  isDeleteMenu: false,
  isDeleteDialog: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
};

// Create the slice with actions and reducers
const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsAddGroupMember: (state, action) => {
      state.isAddGroupAdmin = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsChatMenu: (state, action) => {
      state.isChatMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setIsDeleteDialog: (state, action) => {
      state.isDeleteDialog = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setIsNewGroup,
  setIsAddMember,
  setIsNotification,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsChatMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setIsAddGroupMember,
  setIsDeleteDialog,
} = miscSlice.actions;

export default miscSlice;
