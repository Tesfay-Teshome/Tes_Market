export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'vendor' | 'buyer';
  phone?: string;
  address?: string;
  profile_image?: string;
  store_name?: string;
  store_description?: string;
  is_verified: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  user_type: 'vendor' | 'buyer';
  phone?: string;
  address?: string;
  store_name?: string;
  store_description?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
