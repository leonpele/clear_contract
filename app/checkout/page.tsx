'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

type PlanType = 'one-time' | 'subscription';

function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary mb-4" />
      <p className="text-sm text-ink-muted">Redirecting to secure payment…</p>
    </div>
  );
}

function CheckoutRedirectInner() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    const raw = searchParams.get('plan');
    const planType: PlanType | null =
      raw === 'subscription' || raw === 'one-time' ? raw : null;

    if (!planType) {
      setError('Invalid link. Use ?plan=one-time or ?plan=subscription.');
      return;
    }

    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planType }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };

        if (!res.ok) {
          setError(
            data.error ||
              `Checkout failed (${res.status}). Check Stripe configuration.`
          );
          return;
        }

        if (data.url) {
          window.location.assign(data.url);
          return;
        }

        setError('No checkout URL returned.');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Network error');
      }
    })();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto bg-surface">
        <h1 className="text-xl mb-3">Payment could not start</h1>
        <p className="text-risk-high mb-4 text-sm whitespace-pre-wrap">{error}</p>
        <p className="prose-body text-sm mb-6">
          Verify your Stripe price IDs in environment variables, then try again.
        </p>
        <div className="flex gap-6 text-sm">
          <Link
            href="/"
            className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/analyze"
            className="text-ink-secondary hover:text-ink transition-colors duration-200"
          >
            Analyze
          </Link>
        </div>
        <LegalDisclaimer className="mt-8" />
      </div>
    );
  }

  return <Spinner />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CheckoutRedirectInner />
    </Suspense>
  );
}
