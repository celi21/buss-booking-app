import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";

export const MainStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});
