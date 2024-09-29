import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: false,
  isAdmin: false,
  loader: true,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload.isAdmin; // Update isAdmin based on user data
      state.loader = false;
    },
    clearAuthenticatedUser: (state) => {
      state.user = null;
      state.isAdmin = false; // Reset isAdmin when no user exists
      state.loader = false;
    },
  },
});

export default authSlice;

export const { setAuthenticatedUser, clearAuthenticatedUser } =
  authSlice.actions;
