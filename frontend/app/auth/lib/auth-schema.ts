// app/auth/lib/auth-schema.ts
import { z } from 'zod';

// Sign In Schema
export const signInSchema = z.object({
  username: z.string().min(1, 'Username is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

// Sign Up Schema
export const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    full_name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(50, 'Full name must be less than 50 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export const newPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Type Exports
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
