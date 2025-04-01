import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { authAPI } from '@/services/api';

interface TokenResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  access_token: string | null;
  refresh_token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  access_token: localStorage.getItem('access_token') || null,
  refresh_token: localStorage.getItem('refresh_token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<{ access: string | null; refresh: string | null }>) => {
      state.access_token = action.payload.access;
      state.refresh_token = action.payload.refresh;
      if (action.payload.access !== null) {
        localStorage.setItem('access_token', action.payload.access);
      } else {
        localStorage.removeItem('access_token');
      }
      if (action.payload.refresh !== null) {
        localStorage.setItem('refresh_token', action.payload.refresh);
      } else {
        localStorage.removeItem('refresh_token');
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    login: (state, action: PayloadAction<TokenResponse>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.access_token = action.payload.access;
      state.refresh_token = action.payload.refresh;
      localStorage.setItem('access_token', action.payload.access);
      localStorage.setItem('refresh_token', action.payload.refresh);
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.access_token = null;
      state.refresh_token = null;
      localStorage.clear();
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.access_token = null;
      state.refresh_token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.access_token = action.payload.access;
          state.refresh_token = action.payload.refresh;
          localStorage.setItem('access_token', action.payload.access);
          localStorage.setItem('refresh_token', action.payload.refresh);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        localStorage.clear();
      });
  },
});

export const { setUser, setTokens, setLoading, setError, login, clearAuth, logout } = authSlice.actions;

// Thunks for token refresh
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authAPI.refreshToken(refreshToken);
      return response.data;
    } catch (error: any) {
      localStorage.clear();
      return rejectWithValue(error.response?.data);
    }
  }
);

export default authSlice.reducer;
