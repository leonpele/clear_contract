import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile } from '@/lib/types/profile';
import type { AnalyticsEvent } from './events';

const UNIQUE_VIOLATION = '23505';

/** Records an event. Call with the admin (service-role) client — analytics_events has no RLS policies. */
export async function track(
  admin: SupabaseClient,
  userId: string,
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await admin
    .from('analytics_events')
    .insert({ user_id: userId, event, properties });

  if (error) console.error(`track(${event}):`, error);
}

/** Same as track(), but silently no-ops on a repeat call (DB-enforced once-per-account). */
async function trackOnce(
  admin: SupabaseClient,
  userId: string,
  event: AnalyticsEvent,
  properties: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await admin
    .from('analytics_events')
    .insert({ user_id: userId, event, properties });

  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error(`track(${event}):`, error);
  }
}

const SIGNUP_WINDOW_MS = 60_000;

/**
 * Call whenever a profile is loaded right after auth. Fires `signup` once,
 * the first time any request observes a profile created within the last
 * minute — covers both the DB auto-profile trigger and the app's own
 * fallback insert, whichever created the row.
 */
export async function trackSignupIfNew(
  admin: SupabaseClient,
  profile: Profile
): Promise<void> {
  const createdAt = new Date(profile.created_at).getTime();
  if (Date.now() - createdAt < SIGNUP_WINDOW_MS) {
    await trackOnce(admin, profile.id, 'signup', { email: profile.email });
  }
}

/** First document a user ever submits for analysis. No-ops on later submissions. */
export async function trackFirstDocumentUploaded(
  admin: SupabaseClient,
  userId: string
): Promise<void> {
  await trackOnce(admin, userId, 'first_document_uploaded');
}
