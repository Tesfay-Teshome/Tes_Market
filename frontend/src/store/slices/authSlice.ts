import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types';
import { authAPI } from '@/services/api';

interface TokenResponse {
  access: string;
  refresh: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  tokens: {
    access: string | null;
    refresh: string | null;
  };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  tokens: {
    access: localStorage.getItem('access_token') || null,
    refresh: localStorage.getItem('refresh_token') || null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTokens: (state, action: PayloadAction<TokenResponse>) => {
      state.tokens.access = action.payload.access;
      state.tokens.refresh = action.payload.refresh;
      localStorage.setItem('access_token', action.payload.access);
      localStorage.setItem('refresh_token', action.payload.refresh);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.tokens = {
        access: null,
        refresh: null
      };
      localStorage.clear();
    },
    login: (state, action: PayloadAction<{ user: User; tokens: TokenResponse }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.tokens = {
        access: action.payload.tokens.access,
        refresh: action.payload.tokens.refresh
      };
      localStorage.setItem('access_token', action.payload.tokens.access);
      localStorage.setItem('refresh_token', action.payload.tokens.refresh);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.tokens = {
            access: action.payload.access,
            refresh: action.payload.refresh
          };
          localStorage.setItem('access_token', action.payload.access);
          localStorage.setItem('refresh_token', action.payload.refresh);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.tokens = {
          access: null,
          refresh: null
        };
        localStorage.clear();
      });
  }
});

export const { setUser, setLoading, setTokens, logout, login } = authSlice.actions;

// Thunks for token refresh
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { dispatch }) => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = '/login';
      return;
    }

    try {
      const response = await authAPI.refreshToken(refreshToken);
      const { access } = response.data;
      
      // Store the new token
      localStorage.setItem('access_token', access);
      
      // Get current user data
      const userDataResponse = await authAPI.getCurrentUser();
      const userData = userDataResponse.data;
      
      // Update user type from new token
      const tokenParts = access.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Update user state with complete user data
      dispatch(setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        user_type: payload.user_type,
        phone: userData.phone,
        address: userData.address,
        profile_image: userData.profile_image,
        store_name: userData.store_name,
        store_description: userData.store_description,
        is_verified: userData.is_verified,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      }));
      
      return { access, refresh: refreshToken };
    } catch (error) {
      localStorage.clear();
      window.location.href = '/login';
      throw error;
    }
  }
);

export default authSlice.reducer;
