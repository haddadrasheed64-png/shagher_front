import { configureStore } from "@reduxjs/toolkit";
import apartmentsReducer from "./apartmentsSlice";
import userReducer from "./user_slice";
export const store = configureStore({
  reducer: {
    apartments: apartmentsReducer,
    user: userReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
