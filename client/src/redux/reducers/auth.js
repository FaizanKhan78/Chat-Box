import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";
import toast from "react-hot-toast";
import { getToastConfig } from "../../lib/features";

const initialState = {
  user: false,
  isAdmin: false,
  adminAccess: false,
  loader: true,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload.appAdmin; // Update isAdmin based on user data
      state.loader = false;
    },
    clearAuthenticatedUser: (state) => {
      state.user = null;
      state.isAdmin = false; // Reset isAdmin when no user exists
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        (state.adminAccess = true),
          toast.success(action.payload, {
            style: {
              color: "white",
              backgroundColor: "black",
            },
          });
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.adminAccess = false;
        toast.error(action.error.message, {
          style: {
            color: "white",
            backgroundColor: "black",
          },
        });
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        if (action.payload) {
          state.adminAccess = true;
        } else {
          state.adminAccess = false;
        }
      })
      .addCase(getAdmin.rejected, (state) => {
        state.adminAccess = false;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.adminAccess = false;
        toast.success(action.payload, {
          style: {
            color: "white",
            backgroundColor: "black",
          },
        });
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.adminAccess = false;
        toast.success(action.payload, {
          style: {
            color: "white",
            backgroundColor: "black",
          },
        });
      });
  },
});

export default authSlice;

export const { setAuthenticatedUser, clearAuthenticatedUser } =
  authSlice.actions;
