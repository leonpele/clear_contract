import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

type PlanType = 'one-time' | 'subscription';

function resolvePriceId(planType: PlanType): string | null {
  const oneTime =
    process.env.STRIPE_PRICE_ONETIME ||
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ONETIME;
  const subscription =
    process.env.STRIPE_PRICE_SUBSCRIPTION ||
    process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION;

  const id = planType === 'subscription' ? subscription : oneTime;
  return id?.trim() || null;
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
    const body = (await request.json()) as CheckoutRequest;
    const planType = body.planType;

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
      return NextResponse.json(
        {
          error:
            'Missing or invalid Stripe price IDs. Set STRIPE_PRICE_ONETIME and STRIPE_PRICE_SUBSCRIPTION in your environment (values must start with price_).',
        },
        { status: 503 }
      );
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
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/analyze`,
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
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
