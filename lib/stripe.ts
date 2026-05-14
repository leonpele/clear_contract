/**
 * Stripe publishable key (client) and display-only pricing for the paywall.
 * Actual Stripe Price IDs are resolved on the server in /api/stripe/checkout
 * (STRIPE_PRICE_ONETIME / STRIPE_PRICE_SUBSCRIPTION) so Vercel env changes
 * apply without rebuilding the client bundle.
 */

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};

export const PRICING_PLANS = {
  oneTime: {
    name: 'One-time',
    price: 3,
    currency: 'EUR',
    description: '5 analyses',
    features: ['5 contract analyses', 'Full risk assessment', 'PDF & text support', 'No commitment'],
  },
  subscription: {
    name: 'Pro',
    price: 8,
    currency: 'EUR',
    description: 'Unlimited analyses',
    features: ['Unlimited analyses', 'Full risk assessment', 'PDF & text support', 'Cancel anytime'],
  },
};
