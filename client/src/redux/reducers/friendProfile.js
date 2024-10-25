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
  videoCount: 0,
  imageCount: 0,
  audioCount: 0,
  totalFile: 0,
};
const friendProfileSlice = createSlice({
  name: "friendProfile",
  initialState,
  reducers: {
    setFriendProfile: (state, action) => {
      // Update the state with the new friend profile data
      Object.assign(state, action.payload);

      // Reset and calculate attachment counts
      state.totalFile = 0;
      state.videoCount = 0;
      state.imageCount = 0;
      state.audioCount = 0;

      state.totalFile = state.attachments.length;
      state.attachments.forEach((url) => {
        const type = url?.split(".").pop(); // Get file extension

        if (type === "mp4") {
          state.videoCount += 1;
        } else if (type === "jpg" || type === "jpeg" || type === "png") {
          state.imageCount += 1;
        } else if (type === "mp3" || type === "wav") {
          // Adjust for audio formats
          state.audioCount += 1;
        }
      });
    },
    clearFriendProfile: () => {
      return initialState; // Reset state when clearing
    },
    setVideoCount: (state) => {
      state.totalFile += 1;
      state.videoCount += 1;
    },
    setImageCount: (state) => {
      state.totalFile += 1;
      state.imageCount += 1;
    },
    setAudioCount: (state) => {
      state.totalFile += 1;
      state.audioCount += 1;
    },
  },
});

export default friendProfileSlice;
export const {
  setFriendProfile,
  setVideoCount,
  setImageCount,
  setAudioCount,
  clearFriendProfile,
} = friendProfileSlice.actions;
