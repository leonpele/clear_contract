'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface GoogleSignInButtonProps {
  redirectTo?: string;
}

export function GoogleSignInButton({ redirectTo = '/account' }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const appUrl = window.location.origin;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${appUrl}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (authError) {
      const msg = authError.message.toLowerCase();
      setError(
        msg.includes('provider') || msg.includes('enabled')
          ? 'Google sign-in is not enabled in Supabase (Authentication → Providers → Google).'
          : authError.message
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={loading}
        onClick={handleGoogle}
      >
        {loading ? 'Redirecting…' : 'Continue with Google'}
      </Button>
      {error && (
        <p className="text-sm text-risk-high" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
