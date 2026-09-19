import type { Profile } from '@/lib/types/profile';
import { PRICING_PLANS } from '@/lib/stripe';

/** Credits added on one-time purchase (matches PRICING_PLANS.oneTime). */
export const ONE_TIME_ANALYSIS_CREDITS = 5;

/** Default free tier per calendar month. */
export const FREE_ANALYSES_PER_MONTH = 3;

export function currentUsageMonth(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Pro subscribers with active status get unlimited analyses. */
export function isProActive(profile: Profile): boolean {
  return profile.plan === 'pro' && profile.subscription_status === 'active';
}

/**
 * Used count after calendar-month rollover for pure free users.
 * One-time credit pools do not virtually reset — paid credits deplete.
 */
export function effectiveAnalysesUsed(profile: Profile): number {
  const month = currentUsageMonth();
  if (
    profile.plan === 'free' &&
    profile.purchase_type !== 'one-time' &&
    profile.usage_month !== month
  ) {
    return 0;
  }
  return profile.analyses_used;
}

/** Limit after month rollover for pure free users (before DB sync). */
export function effectiveAnalysesLimit(profile: Profile): number {
  const month = currentUsageMonth();
  if (
    profile.plan === 'free' &&
    profile.purchase_type !== 'one-time' &&
    profile.usage_month !== month
  ) {
    return FREE_ANALYSES_PER_MONTH;
  }
  return profile.analyses_limit;
}

export function canAnalyze(profile: Profile): boolean {
  if (isProActive(profile)) return true;

  const used = effectiveAnalysesUsed(profile);
  return used < effectiveAnalysesLimit(profile);
}

export function getRemainingAnalyses(
  profile: Profile
): number | 'unlimited' {
  if (isProActive(profile)) return 'unlimited';

  const used = effectiveAnalysesUsed(profile);
  return Math.max(0, effectiveAnalysesLimit(profile) - used);
}

export function formatPlanLabel(profile: Profile): string {
  if (isProActive(profile)) return 'Pro';
  if (profile.purchase_type === 'one-time') return 'One-time credits';
  return 'Free';
}

export function formatStatusLabel(profile: Profile): string {
  if (isProActive(profile)) return 'Active';
  if (profile.subscription_status === 'past_due') return 'Past due';
  if (profile.subscription_status === 'canceled') return 'Canceled';
  if (profile.subscription_status === 'inactive') return 'Inactive';
  if (profile.purchase_type === 'one-time') return 'Credits';
  return 'Free tier';
}

export function formatRemainingLabel(profile: Profile): string {
  const remaining = getRemainingAnalyses(profile);
  if (remaining === 'unlimited') return 'Unlimited';
  return String(remaining);
}

export function oneTimePurchaseDescription(): string {
  return PRICING_PLANS.oneTime.description;
}
