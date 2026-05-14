'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type PlanType = 'one-time' | 'subscription';

function Spinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="animate-spin h-10 w-10 border-4 border-risk-red border-t-transparent rounded-full mb-4" />
      <p className="text-gray-600">Redirecting to secure payment…</p>
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
              `Checkout failed (${res.status}). Check Stripe keys and price IDs.`
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto bg-white">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          Payment could not start
        </h1>
        <p className="text-red-700 mb-4 text-sm whitespace-pre-wrap">{error}</p>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Add <code className="bg-gray-100 px-1 rounded">STRIPE_PRICE_ONETIME</code> and{' '}
          <code className="bg-gray-100 px-1 rounded">STRIPE_PRICE_SUBSCRIPTION</code> in
          Vercel (or <code className="bg-gray-100 px-1 rounded">.env.local</code>) with
          values from Stripe → Products → each price → ID starting with{' '}
          <code className="bg-gray-100 px-1">price_</code> (not <code className="bg-gray-100 px-1">prod_</code>).
          Redeploy after saving. Optional: paste the same IDs in{' '}
          <code className="bg-gray-100 px-1">lib/stripePriceIds.ts</code>.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="text-risk-red font-medium underline">
            Home
          </Link>
          <Link href="/analyze" className="text-gray-700 underline">
            Analyze
          </Link>
        </div>
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
