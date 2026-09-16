import { NextResponse } from 'next/server';
import Stripe from 'stripe';

/** Dev helper: verify Stripe price types match env vars. */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const keyMode = secretKey.startsWith('sk_test')
    ? 'test'
    : secretKey.startsWith('sk_live')
      ? 'live'
      : 'unknown';

  async function describe(envName: string, priceId: string | undefined) {
    if (!priceId?.startsWith('price_')) {
      return { envName, priceId: priceId ?? null, error: 'not set or invalid' };
    }
    const price = await stripe.prices.retrieve(priceId);
    return {
      envName,
      priceId,
      type: price.type,
      recurring: price.recurring?.interval ?? null,
      amount: price.unit_amount,
      currency: price.currency,
      active: price.active,
    };
  }

  try {
    const onetime = await describe(
      'STRIPE_PRICE_ONETIME',
      process.env.STRIPE_PRICE_ONETIME ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_ONETIME
    );
    const subscription = await describe(
      'STRIPE_PRICE_SUBSCRIPTION',
      process.env.STRIPE_PRICE_SUBSCRIPTION ||
        process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION
    );

    return NextResponse.json({
      keyMode,
      onetime,
      subscription,
      hint:
        onetime.type === 'one_time'
          ? 'One-time env looks correct. Restart npm run dev after any .env change.'
          : 'STRIPE_PRICE_ONETIME must be type one_time in Stripe.',
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : 'Stripe error',
        keyMode,
      },
      { status: 400 }
    );
  }
}
