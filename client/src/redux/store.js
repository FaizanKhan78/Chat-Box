import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
import friendProfileSlice from "./reducers/friendProfile";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [api.reducerPath]: api.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [friendProfileSlice.name]: friendProfileSlice.reducer,
  },
  middleware: (defaultMiddleWare) => [...defaultMiddleWare(), api.middleware],
});

export default store;
