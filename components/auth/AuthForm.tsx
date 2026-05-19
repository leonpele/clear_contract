'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from './GoogleSignInButton';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthMode;
  redirectTo?: string;
}

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-[15px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

function friendlyAuthError(message: string, mode: AuthMode): string {
  const lower = message.toLowerCase();
  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return mode === 'signup'
      ? 'This email already has an account. Use Sign in instead.'
      : message;
  }
  if (lower.includes('invalid login credentials')) {
    return 'Wrong email or password. Try again or create an account.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Confirm your email first (check your inbox), then sign in.';
  }
  if (lower.includes('invalid api key') || lower.includes('fetch')) {
    return 'Auth is misconfigured. Check Supabase URL and keys in Vercel / .env.local.';
  }
  return message;
}

export function AuthForm({ mode, redirectTo = '/analyze' }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) {
        setError(friendlyAuthError(signUpError.message, mode));
      } else if (data.session) {
        await fetch('/api/profile').catch(() => {});
        router.push(redirectTo);
        router.refresh();
      } else {
        setMessage(
          'Account created. Check your email to confirm, then sign in.'
        );
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(friendlyAuthError(signInError.message, mode));
      } else {
        await fetch('/api/profile').catch(() => {});
        router.push(redirectTo);
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <GoogleSignInButton redirectTo={redirectTo} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-2 text-ink-muted">or email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label-caps block mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className="label-caps block mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-sm text-risk-high" role="alert">
            {error}
          </p>
        )}
        {message && <p className="text-sm text-ink-secondary">{message}</p>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading
            ? 'Please wait…'
            : mode === 'signup'
              ? 'Create account'
              : 'Sign in'}
        </Button>
      </form>

      <p className="text-sm text-ink-muted text-center">
        {mode === 'login' ? (
          <>
            No account?{' '}
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
