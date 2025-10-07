import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: any | null;
  roles?: string[] | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  roles: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("roles") || "null") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user?: any; roles?: string[] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.roles = action.payload.roles || null;

      // persist in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user || null));
        localStorage.setItem("roles", JSON.stringify(action.payload.roles || null));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      // remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
