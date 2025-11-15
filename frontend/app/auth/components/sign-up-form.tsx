// app/auth/components/sign-up-form.tsx
'use client';

import { useAuth } from '@/app/auth/use-auth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { trackEvent } from '@/lib/analytics';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { signUpSchema, type SignUpInput } from '../lib/auth-schema';

export function SignUpForm() {
  const { signup, loading, error } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
      confirmPassword: '',
    },
  });

  const agreeTerms = watch('agreeTerms') || false;

  const onSubmit = async (data: SignUpInput) => {
    try {
      trackEvent({
        event_name: 'sign_up_attempted',
        event_category: 'auth',
        event_label: 'email_password',
      });

      await signup({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });

      // Success is handled in useAuth hook with redirect + toast
      trackEvent({
        event_name: 'sign_up_successful',
        event_category: 'auth',
        event_label: 'email_password',
      });
    } catch (error) {
      trackEvent({
        event_name: 'sign_up_failed',
        event_category: 'auth',
        event_label: 'email_password',
      });
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="mb-1.5 block text-sm font-normal text-gray-400">
          Full Name
        </label>
        <Input
          id="full_name"
          type="text"
          placeholder="John Doe"
          {...register('full_name')}
          className="h-10 border-gray-800 bg-[#1A1A1A] text-white placeholder:text-gray-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
        />
        {errors.full_name && <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-normal text-gray-400">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className="h-10 border-gray-800 bg-[#1A1A1A] text-white placeholder:text-gray-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-normal text-gray-400">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="h-10 border-gray-800 bg-[#1A1A1A] text-white placeholder:text-gray-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
        />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-normal text-gray-400">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className="h-10 border-gray-800 bg-[#1A1A1A] text-white placeholder:text-gray-600 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
      </div>

      {/* API Error Display */}
      {error && (
        <div className="rounded-md border border-red-900/50 bg-red-900/20 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Terms Agreement */}
      <div className="mt-4 flex items-start space-x-2">
        <Checkbox
          id="agreeTerms"
          checked={agreeTerms}
          onCheckedChange={(checked) => setValue('agreeTerms', checked as boolean)}
          className="data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
        />
        <label htmlFor="agreeTerms" className="text-sm leading-tight text-gray-400">
          I agree to the{' '}
          <Link href="/terms" className="text-teal-400 transition-colors hover:text-teal-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-teal-400 transition-colors hover:text-teal-300">
            Privacy Policy
          </Link>
        </label>
        {errors.agreeTerms && <p className="mt-1 text-sm text-red-400">{errors.agreeTerms.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !agreeTerms}
        className="mt-4 h-10 w-full bg-gradient-to-r from-teal-600 to-emerald-600 font-normal text-white hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  );
}
