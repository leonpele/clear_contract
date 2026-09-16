'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LinkButton } from '@/components/ui/LinkButton';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/account');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5 py-12">
      <Card className="max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-risk-low-bg text-risk-low text-lg">
          ✓
        </div>
        <h1 className="text-xl mb-2">Payment successful</h1>
        <p className="prose-body text-sm mb-1">
          Your account will update within a few seconds. Check your plan on the
          account page.
        </p>
        <LinkButton href="/account" className="mt-6 w-full">
          View account
        </LinkButton>
        <LinkButton href="/analyze" variant="secondary" className="mt-3 w-full">
          Analyze a contract
        </LinkButton>
        <p className="text-xs text-ink-faint mt-6">
          Redirecting to account in 5 seconds…
        </p>
        <LegalDisclaimer className="mt-6 text-left" />
      </Card>
    </div>
  );
}
