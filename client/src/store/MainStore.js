import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import busTypeReducer from "./slices/BusTypeSlice";
import routesReducer from "./slices/RoutesSlice";

export const MainStore = configureStore({
  reducer: {
    auth: authReducer,
    busType: busTypeReducer,
    routes: routesReducer,
  },
});
