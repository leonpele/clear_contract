'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthForm } from '@/components/auth/AuthForm';

function SignupContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/analyze';

  return (
    <AuthShell
      title="Create account"
      subtitle="Free tier includes 3 contract analyses per month."
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
