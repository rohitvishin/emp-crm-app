import idReducer from "@/src/idSlice";
import visitReducer from "@/src/visitSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    visit: visitReducer,
    ids: idReducer,
  },
});

// types for usage in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
