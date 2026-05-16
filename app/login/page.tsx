'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/analyze';
  const authError = searchParams.get('error');

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your analyses, usage, and subscription."
    >
      {authError && (
        <p className="mb-4 text-sm text-risk-high" role="alert">
          Sign-in failed. Please try again.
        </p>
      )}
      <AuthForm mode="login" redirectTo={redirectTo} />
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
