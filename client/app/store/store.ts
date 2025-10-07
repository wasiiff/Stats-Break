import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "../services/chatApi";
import { authApi } from "../services/authApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
