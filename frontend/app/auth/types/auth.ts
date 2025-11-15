// @/types/auth.ts

/**
 * User object returned from the API
 */
export interface User {
  id: string;
  email: string;
  avatar?: string;
  full_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  avatar_id?: string | null;
  total_habits_completed?: number;
  self_mastery_score?: number;
  level?: number;
}

/**
 * Token response from login endpoint
 */
export interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
  user: User;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string; // API uses 'username' field for email
  password: string;
}

/**
 * Signup/Register request payload
 */
export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
}

/**
 * Auth store state interface
 */
export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}
