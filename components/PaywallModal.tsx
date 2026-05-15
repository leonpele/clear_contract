'use client';

import { useState } from 'react';
import { PRICING_PLANS } from '@/lib/stripe';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/parseUsage';

interface PaywallModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaywallModal({ onClose, onPaymentSuccess: _onPaymentSuccess }: PaywallModalProps) {
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
            `Checkout failed (${response.status}). Check server logs and Stripe configuration.`
        );
      }

      if (data.url) {
        window.location.assign(data.url);
        return;
      }

      throw new Error(data.error || 'No checkout URL received from the server.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Unlock unlimited analyses</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600">
            You've used your {FREE_ANALYSES_PER_MONTH} free analyses this month. Choose a plan to continue analyzing contracts.
          </p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm whitespace-pre-wrap">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* One-time Plan */}
            <div className="border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">One-time</h3>
              <div className="text-4xl font-bold text-risk-red mb-4">
                €{PRICING_PLANS.oneTime.price}
              </div>
              <p className="text-gray-600 mb-6">{PRICING_PLANS.oneTime.description}</p>
              <ul className="space-y-2 mb-6">
                {PRICING_PLANS.oneTime.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleCheckout('one-time')}
                disabled={loading}
                className="w-full py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Processing...' : 'Choose Plan'}
              </button>
            </div>

            {/* Subscription Plan */}
            <div className="border-2 border-risk-red p-6 rounded-lg bg-red-50">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Pro (Recommended)</h3>
              <div className="text-4xl font-bold text-risk-red mb-1">
                €{PRICING_PLANS.subscription.price}
              </div>
              <p className="text-gray-600 text-sm mb-6">/month, cancel anytime</p>
              <p className="text-gray-600 mb-6">{PRICING_PLANS.subscription.description}</p>
              <ul className="space-y-2 mb-6">
                {PRICING_PLANS.subscription.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700 text-sm">
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleCheckout('subscription')}
                disabled={loading}
                className="w-full py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>

          <p className="text-gray-500 text-xs text-center">
            Payments secured by Stripe. Your information is never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
