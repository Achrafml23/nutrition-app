// @/api/auth.ts
import type { User } from '@/app/auth/types/auth';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Separate axios instance for auth to avoid interceptor loops
const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ==================== TYPES ====================

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ==================== AUTH FUNCTIONS ====================

/**
 * Login user with credentials
 * Backend expects OAuth2 form data format
 */
export async function loginUser({ username, password }: LoginInput): Promise<AuthResponse> {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await authApi.post<AuthResponse>('/login/access-token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
}

/**
 * Register new user
 */
export async function registerUser({ email, password, full_name }: SignupInput): Promise<User> {
  const response = await authApi.post<User>('/users/signup', {
    email,
    password,
    full_name,
  });
  return response.data;
}

/**
 * Refresh access token using httpOnly refresh_token cookie
 */
export async function refreshAccessToken(): Promise<AuthResponse | null> {
  try {
    const response = await authApi.post<AuthResponse>('/login/refresh-token');
    return response.data;
  } catch (err) {
    console.error('Token refresh failed:', err);
    return null;
  }
}

/**
 * Fetch current user profile
 */
export async function fetchCurrentUser(accessToken: string): Promise<User> {
  const response = await authApi.get<User>('/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

/**
 * Logout user - invalidates refresh token on backend
 */
export async function logoutUser(): Promise<void> {
  try {
    await authApi.post('/logout');
  } catch (err) {
    console.error('Logout API call failed:', err);
    // Don't throw - still clear local state
  }
}
