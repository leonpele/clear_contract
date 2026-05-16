'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/ui/AppHeader';
import { AuthNav } from '@/components/auth/AuthNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PRICING_PLANS } from '@/lib/stripe';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import type { Profile } from '@/lib/types/profile';

export default function PremiumPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.profile) setProfile(data.profile);
      })
      .catch(() => {});
  }, []);

  const handleCheckout = async (planType: 'one-time' | 'subscription') => {
    setLoading(true);
    setError('');

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
        if (res.status === 401) {
          window.location.href = `/login?redirect=/premium`;
          return;
        }
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.url) {
        window.location.assign(data.url);
        return;
      }

      throw new Error('No checkout URL');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader action={<AuthNav />} />
      <main className="mx-auto max-w-wide px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="mb-2">Upgrade</h1>
        <p className="prose-body text-sm mb-8 max-w-content">
          Choose the same plans as before — One-time credits or Pro unlimited.
          Your account updates automatically after payment.
        </p>

        {profile?.plan === 'pro' && profile.subscription_status === 'active' && (
          <Card muted className="mb-6">
            <p className="text-sm text-ink-secondary">
              You already have an active Pro subscription.
            </p>
          </Card>
        )}

        {error && (
          <p className="mb-6 text-sm text-risk-high rounded-lg border border-risk-high-border bg-risk-high-bg px-4 py-3 whitespace-pre-wrap">
            {error}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
          <Card muted className="shadow-none flex flex-col">
            <h2 className="text-lg mb-1">One-time</h2>
            <p className="text-2xl font-semibold mb-4">
              €{PRICING_PLANS.oneTime.price}
            </p>
            <p className="text-sm text-ink-muted mb-4 flex-1">
              {PRICING_PLANS.oneTime.description}
            </p>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              disabled={loading}
              onClick={() => handleCheckout('one-time')}
            >
              Buy credits
            </Button>
          </Card>

          <Card className="shadow-none flex flex-col border-primary/20 ring-1 ring-primary/10">
            <p className="text-xs font-medium text-primary mb-2">Recommended</p>
            <h2 className="text-lg mb-1">Pro</h2>
            <p className="text-2xl font-semibold mb-1">
              €{PRICING_PLANS.subscription.price}
              <span className="text-sm font-normal text-ink-muted">/mo</span>
            </p>
            <p className="text-sm text-ink-muted mb-4 flex-1">
              {PRICING_PLANS.subscription.description}
            </p>
            <Button
              type="button"
              fullWidth
              disabled={loading}
              onClick={() => handleCheckout('subscription')}
            >
              Subscribe
            </Button>
          </Card>
        </div>

        <LegalDisclaimer className="mt-8" />
      </main>
    </div>
  );
}
