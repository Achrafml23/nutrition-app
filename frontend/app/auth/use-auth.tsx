// @/hooks/use-auth.ts
import type { LoginInput, SignupInput } from '@/app/auth/api/auth';
import { loginUser, logoutUser, registerUser } from '@/app/auth/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// ==================== TYPES ====================

interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

interface UseAuthReturn {
  login: (data: LoginInput) => Promise<void>;
  signup: (data: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// ==================== HOOK ====================

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuth, clearAuth, setLoading: setStoreLoading, setError: setStoreError } = useAuthStore();

  const router = useRouter();
  const queryClient = useQueryClient();

  /**
   * Extract error message from API error response
   */
  const getErrorMessage = useCallback((err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      return axiosError.response?.data?.detail || axiosError.response?.data?.message || 'An error occurred';
    }
    return 'An error occurred';
  }, []);

  /**
   * Login user with credentials
   */
  const login = useCallback(
    async (data: LoginInput): Promise<void> => {
      try {
        console.log('🔐 Auth: Starting login process...');
        setLoading(true);
        setStoreLoading(true);
        setError(null);
        setStoreError(null);

        const authResponse = await loginUser(data);

        console.log('✅ Auth: Login successful, setting auth state');
        setAuth(authResponse.user, authResponse.access_token);

        toast.success('Logged in successfully!');

        console.log('🏠 Auth: Redirecting to /habits');
        router.push('/habits');
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);

        console.error('❌ Auth: Login failed:', errorMessage);
        setError(errorMessage);
        setStoreError(errorMessage);
        toast.error('Login failed');
      } finally {
        setLoading(false);
        setStoreLoading(false);
      }
    },
    [setAuth, setStoreLoading, setStoreError, router, getErrorMessage],
  );

  /**
   * Sign up new user
   */
  const signup = useCallback(
    async (data: SignupInput): Promise<void> => {
      try {
        console.log('📝 Auth: Starting signup process...');
        setLoading(true);
        setStoreLoading(true);
        setError(null);
        setStoreError(null);

        await registerUser(data);

        console.log('✅ Auth: Signup successful');
        toast.success('Account created! Please sign in.');

        console.log('🏠 Auth: Redirecting to /sign-in');
        router.push('/sign-in');
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);

        console.error('❌ Auth: Signup failed:', errorMessage);
        setError(errorMessage);
        setStoreError(errorMessage);
        toast.error('Signup failed');
      } finally {
        setLoading(false);
        setStoreLoading(false);
      }
    },
    [setStoreLoading, setStoreError, router, getErrorMessage],
  );

  /**
   * Logout user and clear all state
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('👋 Auth: Starting logout process...');
      setStoreLoading(true);

      await logoutUser();

      console.log('✅ Auth: Logout API call successful');
    } catch (err) {
      console.warn('⚠️ Auth: Logout API call failed, clearing local state anyway');
    } finally {
      console.log('🧹 Auth: Clearing auth state and query cache');
      clearAuth();
      queryClient.clear();

      toast.success('Logged out successfully');

      console.log('🏠 Auth: Redirecting to /sign-in');
      router.push('/sign-in');
      setStoreLoading(false);
    }
  }, [clearAuth, setStoreLoading, queryClient, router]);

  return {
    login,
    signup,
    logout,
    loading,
    error,
  };
}
