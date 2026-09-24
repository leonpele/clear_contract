import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  ensureProfile,
  getProfileByUserId,
  syncUsageMonth,
} from '@/lib/profile/service';
import {
  canAnalyze,
  getRemainingAnalyses,
  formatPlanLabel,
  formatStatusLabel,
  formatRemainingLabel,
  effectiveAnalysesUsed,
  effectiveAnalysesLimit,
} from '@/lib/entitlements';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let profile = await ensureProfile(supabase, user.id, user.email);

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  try {
    const admin = createAdminClient();
    profile = await syncUsageMonth(admin, profile);
  } catch (err) {
    console.error('profile syncUsageMonth:', err);
  }

  return NextResponse.json({
    profile,
    canAnalyze: canAnalyze(profile),
    remaining: getRemainingAnalyses(profile),
    usage: {
      used: effectiveAnalysesUsed(profile),
      limit: effectiveAnalysesLimit(profile),
    },
    labels: {
      plan: formatPlanLabel(profile),
      status: formatStatusLabel(profile),
      remaining: formatRemainingLabel(profile),
    },
  });
}
