import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import {
  STRIPE_FALLBACK_PRICE_ONETIME,
  STRIPE_FALLBACK_PRICE_SUBSCRIPTION,
} from '@/lib/stripePriceIds';

type PlanType = 'one-time' | 'subscription';

function pickPriceId(raw: string | undefined, fallback: string): string | null {
  const fromEnv = raw?.trim();
  if (fromEnv?.startsWith('price_')) return fromEnv;
  const fb = fallback?.trim();
  if (fb?.startsWith('price_')) return fb;
  return null;
}

function resolvePriceId(planType: PlanType): string | null {
  if (planType === 'subscription') {
    return pickPriceId(
      process.env.STRIPE_PRICE_SUBSCRIPTION ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION,
      STRIPE_FALLBACK_PRICE_SUBSCRIPTION
    );
  }
  return pickPriceId(
    process.env.STRIPE_PRICE_ONETIME ||
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ONETIME,
    STRIPE_FALLBACK_PRICE_ONETIME
  );
}

/** Ensures one-time plan uses a non-recurring Stripe Price (and vice versa). */
async function validatePriceForPlan(
  stripe: Stripe,
  priceId: string,
  planType: PlanType
): Promise<string | null> {
  const price = await stripe.prices.retrieve(priceId);
  const isRecurring = price.type === 'recurring' || Boolean(price.recurring);

  if (planType === 'one-time' && isRecurring) {
    return `STRIPE_PRICE_ONETIME is set to a recurring price (${priceId}). In Stripe Dashboard create a one-time price (Pricing → product → one-time), copy its price_… ID into STRIPE_PRICE_ONETIME in .env.local, then restart npm run dev. You may have swapped ONETIME and SUBSCRIPTION IDs.`;
  }

  if (planType === 'subscription' && !isRecurring) {
    return `STRIPE_PRICE_SUBSCRIPTION is set to a one-time price (${priceId}). Use a recurring monthly price for Pro in STRIPE_PRICE_SUBSCRIPTION.`;
  }

  return null;
}

interface CheckoutRequest {
  planType: PlanType;
  /** @deprecated server resolves price from env; ignored if planType is set */
  priceId?: string;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return NextResponse.json(
      { error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Sign in required before checkout.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CheckoutRequest;
    const planType = body.planType;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[checkout]', { planType, userId: user.id });
    }

    if (planType !== 'one-time' && planType !== 'subscription') {
      return NextResponse.json(
        { error: 'Invalid planType. Use "one-time" or "subscription".' },
        { status: 400 }
      );
    }

    let priceId = resolvePriceId(planType);
    if (!priceId && body.priceId?.startsWith('price_')) {
      priceId = body.priceId;
    }

    if (!priceId?.startsWith('price_')) {
      const hint =
        planType === 'subscription'
          ? 'Missing STRIPE_PRICE_SUBSCRIPTION (or NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION), or set STRIPE_FALLBACK_PRICE_SUBSCRIPTION in lib/stripePriceIds.ts. Value must start with price_.'
          : 'Missing STRIPE_PRICE_ONETIME (or NEXT_PUBLIC_STRIPE_PRICE_ONETIME), or set STRIPE_FALLBACK_PRICE_ONETIME in lib/stripePriceIds.ts. Value must start with price_.';
      return NextResponse.json({ error: hint }, { status: 503 });
    }

    const priceMismatch = await validatePriceForPlan(stripe, priceId, planType);
    if (priceMismatch) {
      return NextResponse.json({ error: priceMismatch }, { status: 400 });
    }

    if (process.env.NODE_ENV !== 'production') {
      const price = await stripe.prices.retrieve(priceId);
      console.log('[checkout] price', {
        priceId,
        type: price.type,
        recurring: price.recurring?.interval ?? null,
        mode: planType === 'subscription' ? 'subscription' : 'payment',
      });
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    ).replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: planType === 'subscription' ? 'subscription' : 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/analyze`,
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata: {
        supabase_user_id: user.id,
        plan_type: planType,
      },
      subscription_data:
        planType === 'subscription'
          ? {
              metadata: {
                supabase_user_id: user.id,
                plan_type: 'subscription',
              },
            }
          : undefined,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Stripe did not return a checkout URL.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error in /api/stripe/checkout:', error);

    if (error instanceof Stripe.errors.StripeError) {
      let message = error.message;
      const isMissingPrice =
        error.code === 'resource_missing' ||
        /no such price/i.test(message);

      if (isMissingPrice) {
        message += `

Likely cause: your secret key and this Price ID are not in the same Stripe mode. If STRIPE_SECRET_KEY starts with sk_test_, create/copy the price in Test mode (toggle in the Stripe Dashboard). If it starts with sk_live_, use a price created in Live mode.`;
      }

      if (/recurring price/i.test(message) || /one-time prices/i.test(message)) {
        message += `

Fix: In .env.local, STRIPE_PRICE_ONETIME must be a one-time price_… and STRIPE_PRICE_SUBSCRIPTION must be a recurring price_…. Check Stripe Dashboard → Products (Test mode).`;
      }

      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
