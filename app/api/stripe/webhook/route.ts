import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  applyOneTimePurchase,
  applyProSubscription,
  deactivateProSubscription,
} from '@/lib/profile/service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

function getUserIdFromMetadata(
  metadata: Stripe.Metadata | null | undefined
): string | null {
  return metadata?.supabase_user_id ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        getUserIdFromMetadata(session.metadata) ??
        session.client_reference_id;

      if (!userId) {
        console.error('checkout.session.completed: no user id in metadata');
      } else {
        const planType = session.metadata?.plan_type;

        if (session.mode === 'subscription' || planType === 'subscription') {
          await applyProSubscription(
            admin,
            userId,
            session.customer as string | null,
            session.subscription as string | null
          );
        } else {
          await applyOneTimePurchase(admin, userId);
        }
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = getUserIdFromMetadata(subscription.metadata);

      if (userId) {
        if (
          subscription.status === 'active' ||
          subscription.status === 'trialing'
        ) {
          await applyProSubscription(
            admin,
            userId,
            subscription.customer as string,
            subscription.id
          );
        } else if (
          subscription.status === 'canceled' ||
          subscription.status === 'unpaid' ||
          subscription.status === 'past_due'
        ) {
          await admin
            .from('profiles')
            .update({
              subscription_status:
                subscription.status === 'past_due' ? 'past_due' : 'inactive',
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = getUserIdFromMetadata(subscription.metadata);

      if (userId) {
        await deactivateProSubscription(admin, userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in /api/stripe/webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
