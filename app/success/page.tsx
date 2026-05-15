'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setPaidUser } from '@/lib/parseUsage';
import { LinkButton } from '@/components/ui/LinkButton';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    setPaidUser();

    const timer = setTimeout(() => {
      router.push('/analyze');
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
          Your account has been upgraded. You now have full access to
          ContractClear.
        </p>
        <LinkButton href="/analyze" className="mt-8 w-full">
          Start analyzing
        </LinkButton>
        <p className="text-xs text-ink-faint mt-6">
          Redirecting in 5 seconds…
        </p>
        <LegalDisclaimer className="mt-6 text-left" />
      </Card>
    </div>
  );
}
