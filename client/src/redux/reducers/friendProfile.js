import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  groupChat: false,
  bio: "",
  avatar: "",
  creator: "",
  groupAdmin: [],
  members: [],
  attachments: [],
};

const friendProfileSlice = createSlice({
  name: "friendProfile",
  initialState,
  reducers: {
    setFriendProfile: (state, action) => {
      return (state = action.payload);
    },
  },
});

export default friendProfileSlice;
export const { setFriendProfile } = friendProfileSlice.actions;
