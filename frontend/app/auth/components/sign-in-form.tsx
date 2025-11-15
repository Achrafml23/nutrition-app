// app/auth/components/sign-in-form.tsx
'use client';

import { useAuth } from '@/app/auth/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackEvent } from '@/lib/analytics';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { signInSchema, type SignInInput } from '../lib/auth-schema';

export function SignInForm() {
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInInput) => {
    try {
      trackEvent({
        event_name: 'sign_in_attempted',
        event_category: 'auth',
        event_label: 'email_password',
      });

      await login(data);

      trackEvent({
        event_name: 'sign_in_successful',
        event_category: 'auth',
        event_label: 'email_password',
      });
    } catch (error) {
      trackEvent({
        event_name: 'sign_in_failed',
        event_category: 'auth',
        event_label: 'email_password',
      });
    }
  };

  const handleGoogleSignIn = () => {
    trackEvent({
      event_name: 'sign_in_attempted',
      event_category: 'auth',
      event_label: 'google',
    });

    // TODO: Implement Google OAuth
    toast.info('Google sign-in coming soon!');
  };

  const handleSSOSignIn = () => {
    trackEvent({
      event_name: 'sign_in_attempted',
      event_category: 'auth',
      event_label: 'sso',
    });

    // TODO: Implement SSO
    toast.info('SSO coming soon!');
  };

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-normal text-gray-400">
          Email
        </label>
        <Input
          id="username"
          type="email"
          placeholder="you@example.com"
          {...register('username')}
          className="h-10 border-gray-800 bg-[#1A1A1A] text-white placeholder:text-gray-600 focus-visible:border-teal-500 focus-visible:ring-teal-500 focus-visible:ring-offset-0"
        />
        {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-normal text-gray-400">
            Password
          </label>
          <button
            type="button"
            onClick={() => router.push('/auth/forgot-password')}
            className="text-sm text-gray-400 transition-colors hover:text-teal-300"
          >
            Forgot Password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="h-10 border-gray-800 bg-[#1A1A1A] text-white placeholder:text-gray-600 focus-visible:border-teal-500 focus-visible:ring-teal-500 focus-visible:ring-offset-0"
        />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
      </div>

      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-900/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 h-10 w-full bg-gradient-to-r from-teal-600 to-emerald-600 font-normal text-white hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  );
}
