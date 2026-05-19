import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnalysisResult } from '@/lib/analysisTypes';
import type { Profile } from '@/lib/types/profile';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  ONE_TIME_ANALYSIS_CREDITS,
  FREE_ANALYSES_PER_MONTH,
  currentUsageMonth,
  effectiveAnalysesUsed,
} from '@/lib/entitlements';

function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === '23505';
}

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('getProfileByUserId:', error);
    return null;
  }

  return data as Profile | null;
}

async function insertProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | undefined
): Promise<Profile | null> {
  const month = currentUsageMonth();
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email ?? null,
      plan: 'free',
      analyses_used: 0,
      analyses_limit: FREE_ANALYSES_PER_MONTH,
      usage_month: month,
    })
    .select('*')
    .single();

  if (!error && data) return data as Profile;

  if (isUniqueViolation(error)) {
    return getProfileByUserId(supabase, userId);
  }

  if (error) console.error('ensureProfile insert:', error);
  return null;
}

export async function ensureProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string | undefined
): Promise<Profile | null> {
  const existing = await getProfileByUserId(supabase, userId);
  if (existing) return existing;

  let profile = await insertProfile(supabase, userId, email);
  if (profile) return profile;

  try {
    const admin = createAdminClient();
    profile = await getProfileByUserId(admin, userId);
    if (profile) return profile;

    profile = await insertProfile(admin, userId, email);
    if (profile) return profile;

    return getProfileByUserId(admin, userId);
  } catch (adminErr) {
    console.error('ensureProfile admin fallback:', adminErr);
    return null;
  }
}

/** Reset free-tier counter when calendar month changes. */
async function syncUsageMonth(
  admin: SupabaseClient,
  profile: Profile
): Promise<Profile> {
  const month = currentUsageMonth();
  if (profile.plan !== 'free' || profile.usage_month === month) {
    return profile;
  }

  const { data, error } = await admin
    .from('profiles')
    .update({
      analyses_used: 0,
      usage_month: month,
      analyses_limit: FREE_ANALYSES_PER_MONTH,
    })
    .eq('id', profile.id)
    .select('*')
    .single();

  if (error) {
    console.error('syncUsageMonth:', error);
    return profile;
  }

  return data as Profile;
}

export async function incrementAnalysisUsage(
  admin: SupabaseClient,
  profile: Profile
): Promise<Profile | null> {
  let current = await syncUsageMonth(admin, profile);

  if (current.plan === 'pro' && current.subscription_status === 'active') {
    return current;
  }

  const used = effectiveAnalysesUsed(current) + 1;
  const { data, error } = await admin
    .from('profiles')
    .update({
      analyses_used: used,
      usage_month: currentUsageMonth(),
    })
    .eq('id', current.id)
    .select('*')
    .single();

  if (error) {
    console.error('incrementAnalysisUsage:', error);
    return null;
  }

  return data as Profile;
}

export async function applyOneTimePurchase(
  admin: SupabaseClient,
  userId: string,
  credits = ONE_TIME_ANALYSIS_CREDITS
): Promise<void> {
  const profile = await getProfileByUserId(admin, userId);
  if (!profile) return;

  const { error } = await admin
    .from('profiles')
    .update({
      purchase_type: 'one-time',
      analyses_limit: profile.analyses_limit + credits,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) console.error('applyOneTimePurchase:', error);
}

export async function applyProSubscription(
  admin: SupabaseClient,
  userId: string,
  stripeCustomerId?: string | null,
  stripeSubscriptionId?: string | null
): Promise<void> {
  const { error } = await admin
    .from('profiles')
    .update({
      plan: 'pro',
      subscription_status: 'active',
      purchase_type: null,
      stripe_customer_id: stripeCustomerId ?? undefined,
      stripe_subscription_id: stripeSubscriptionId ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) console.error('applyProSubscription:', error);
}

export async function deactivateProSubscription(
  admin: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await admin
    .from('profiles')
    .update({
      plan: 'free',
      subscription_status: 'inactive',
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) console.error('deactivateProSubscription:', error);
}

export async function saveAnalysisHistory(
  admin: SupabaseClient,
  userId: string,
  contractText: string,
  analysis: AnalysisResult
): Promise<void> {
  const preview = contractText.slice(0, 500);
  const { error } = await admin.from('contract_analyses').insert({
    user_id: userId,
    contract_preview: preview,
    analysis_json: analysis as unknown as Record<string, unknown>,
    risk_score_percentage: analysis.risk_score.percentage,
  });

  if (error) console.error('saveAnalysisHistory:', error);
}
