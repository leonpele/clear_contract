'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/entitlements';

function SignupContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/analyze';

  return (
    <AuthShell
      title="Create account"
      subtitle={`Free tier includes ${FREE_ANALYSES_PER_MONTH} contract analyses per month.`}
    >
      <AuthForm mode="signup" redirectTo={redirectTo} />
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupContent />
    </Suspense>
  );
}
