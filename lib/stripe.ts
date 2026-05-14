/**
 * Stripe SDK client configuration and pricing information
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
    // Must be a Price ID (price_…), not a Product ID (prod_…). Dashboard → Product → Pricing → copy price ID.
    priceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ONETIME || 'price_one_time_plan_id_here',
    features: ['5 contract analyses', 'Full risk assessment', 'PDF & text support', 'No commitment'],
  },
  subscription: {
    name: 'Pro',
    price: 8,
    currency: 'EUR',
    description: 'Unlimited analyses',
    // Same as one-time: use a recurring Price ID (price_…).
    priceId:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION ||
      'price_subscription_plan_id_here',
    features: ['Unlimited analyses', 'Full risk assessment', 'PDF & text support', 'Cancel anytime'],
  },
};
