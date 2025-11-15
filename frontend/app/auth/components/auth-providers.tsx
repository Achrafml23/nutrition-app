// app/auth/components/auth-providers.tsx
'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/google';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';

export function AuthProviders() {
  const handleGoogleSignIn = () => {
    trackEvent({
      event_name: 'social_login_attempted',
      event_category: 'auth',
      event_label: 'google',
    });

    // TODO: Implement Google OAuth
    toast.info('Google sign-in coming soon!');
  };

  const handleSSOSignIn = () => {
    trackEvent({
      event_name: 'sso_login_attempted',
      event_category: 'auth',
      event_label: 'enterprise',
    });

    // TODO: Implement SSO
    toast.info('SSO coming soon!');
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        className="h-10 w-full justify-center border-gray-700 bg-[#1A1A1A] font-normal text-gray-300 transition-colors hover:bg-[#222222] hover:text-white"
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        <span>Continue with Google</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={handleSSOSignIn}
        className="h-10 w-full justify-center border-gray-700 bg-[#1A1A1A] font-normal text-gray-300 transition-colors hover:bg-[#222222] hover:text-white"
      >
        <Lock className="mr-2 h-4 w-4" />
        <span>Continue with SSO</span>
      </Button>
    </div>
  );
}
