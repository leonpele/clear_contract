import { createHash } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AnalysisResult, GuestAnalysisPreview } from '@/lib/analysisTypes';

/** httpOnly cookie holding the id of the visitor's pending (unclaimed) analysis. */
export const GUEST_COOKIE = 'cc_guest_analysis';

const GUEST_TTL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
export const GUEST_COOKIE_MAX_AGE_S = GUEST_TTL_DAYS * 24 * 60 * 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Every analysis costs an OpenAI call, so visitors are capped per IP per day. */
function maxGuestAnalysesPerDay(): number {
  const fromEnv = Number(process.env.GUEST_ANALYSES_PER_IP_PER_DAY);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return process.env.NODE_ENV === 'production' ? 3 : 50;
}

export function isValidGuestId(value: string | undefined): value is string {
  return !!value && UUID_RE.test(value);
}

export function hashClientIp(headers: Headers): string {
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

export function buildGuestPreview(analysis: AnalysisResult): GuestAnalysisPreview {
  return {
    locked: true,
    risk_level: analysis.risk_score.level,
    risky_clause_count: analysis.risky_clauses.length,
  };
}

export async function isGuestRateLimited(
  admin: SupabaseClient,
  ipHash: string
): Promise<boolean> {
  const since = new Date(Date.now() - DAY_MS).toISOString();
  const { count, error } = await admin
    .from('guest_analyses')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);

  if (error) {
    console.error('isGuestRateLimited:', error);
    return true; // fail closed: an unknown count must not open the OpenAI tap
  }

  return (count ?? 0) >= maxGuestAnalysesPerDay();
}

function staleCutoff(): string {
  return new Date(Date.now() - GUEST_TTL_DAYS * DAY_MS).toISOString();
}

/** Drops unclaimed results older than the cookie lifetime; they can no longer be claimed. */
async function purgeStaleGuestAnalyses(admin: SupabaseClient): Promise<void> {
  const { error } = await admin
    .from('guest_analyses')
    .delete()
    .is('claimed_by', null)
    .lt('created_at', staleCutoff());

  if (error) console.error('purgeStaleGuestAnalyses:', error);
}

export async function saveGuestAnalysis(
  admin: SupabaseClient,
  ipHash: string,
  contractText: string,
  analysis: AnalysisResult
): Promise<string | null> {
  await purgeStaleGuestAnalyses(admin);

  const { data, error } = await admin
    .from('guest_analyses')
    .insert({
      ip_hash: ipHash,
      contract_text: contractText,
      analysis_json: analysis as unknown as Record<string, unknown>,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('saveGuestAnalysis:', error);
    return null;
  }

  return data.id as string;
}

export interface ClaimedGuestAnalysis {
  analysis: AnalysisResult;
  contractText: string;
}

/**
 * Atomically attaches a pending analysis to a user. The `claimed_by is null`
 * filter makes a second concurrent claim (double click, two tabs) match no row.
 * Once claimed, the contract text and result are scrubbed: the member's copy
 * lives in contract_analyses from then on.
 */
export async function claimGuestAnalysis(
  admin: SupabaseClient,
  id: string,
  userId: string
): Promise<ClaimedGuestAnalysis | null> {
  const { data, error } = await admin
    .from('guest_analyses')
    .update({ claimed_by: userId, claimed_at: new Date().toISOString() })
    .eq('id', id)
    .is('claimed_by', null)
    .gte('created_at', staleCutoff())
    .select('contract_text, analysis_json')
    .maybeSingle();

  if (error) {
    console.error('claimGuestAnalysis:', error);
    return null;
  }
  if (!data) return null;

  const { error: scrubError } = await admin
    .from('guest_analyses')
    .update({ contract_text: '', analysis_json: {} })
    .eq('id', id);

  if (scrubError) console.error('claimGuestAnalysis scrub:', scrubError);

  return {
    analysis: data.analysis_json as unknown as AnalysisResult,
    contractText: data.contract_text as string,
  };
}
