'use client';

import { useState } from 'react';
import { PRICING_PLANS } from '@/lib/stripe';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/parseUsage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface PaywallModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaywallModal({
  onClose,
  onPaymentSuccess: _onPaymentSuccess,
}: PaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async (planType: 'one-time' | 'subscription') => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Checkout failed (${response.status}). Check Stripe configuration.`
        );
      }

      if (data.url) {
        window.location.assign(data.url);
        return;
      }

      throw new Error(data.error || 'No checkout URL received.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl">Continue analyzing</h2>
            <p className="prose-body text-sm mt-1">
              You&apos;ve used your {FREE_ANALYSES_PER_MONTH} free analyses this
              month.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-ink text-xl leading-none p-1 transition-colors duration-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && (
          <p className="mb-6 rounded-lg border border-risk-high-border bg-risk-high-bg px-4 py-3 text-sm text-risk-high whitespace-pre-wrap">
            {error}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card muted className="shadow-none flex flex-col">
            <h3 className="mb-1">One-time</h3>
            <p className="text-2xl font-semibold text-ink mb-4">
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
              {loading ? 'Processing…' : 'Choose plan'}
            </Button>
          </Card>

          <Card className="shadow-none flex flex-col border-primary/20 ring-1 ring-primary/10">
            <p className="text-xs font-medium text-primary mb-2">Recommended</p>
            <h3 className="mb-1">Pro</h3>
            <p className="text-2xl font-semibold text-ink mb-1">
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
              {loading ? 'Processing…' : 'Subscribe'}
            </Button>
          </Card>
        </div>

        <p className="text-xs text-ink-faint text-center mt-6">
          Payments secured by Stripe. We never store your card details.
        </p>
      </Card>
    </div>
  );
}
