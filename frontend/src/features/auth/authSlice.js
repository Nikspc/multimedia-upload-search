import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/register", payload);
      return data.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/auth/login", payload);
      return data.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const me = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/auth/me");
      return data.user;
    } catch (err) {
      // IMPORTANT: If not logged in, backend returns 401. Treat as "no session", not UI error.
      if (err?.response?.status === 401) {
        return rejectWithValue(null); // silent
      }
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/auth/logout");
      return true;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle", // idle | loading | succeeded | failed
    error: null
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (b) => {
    b
      // REGISTER
      .addCase(register.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
        s.error = null;
      })
      .addCase(register.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Registration failed";
      })

      // LOGIN
      .addCase(login.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
        s.error = null;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Login failed";
      })

      // ME
      .addCase(me.pending, (s) => { s.status = "loading"; })
      .addCase(me.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.user = a.payload;
      })
      .addCase(me.rejected, (s, a) => {
        // silent 401 => payload null
        s.status = "idle";
        s.user = null;
        if (a.payload) s.error = a.payload; // only set error if it wasn't silent
      })

      // LOGOUT
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
        s.error = null;
      })
      .addCase(logout.rejected, (s, a) => {
        s.error = a.payload || "Logout failed";
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;