import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureProfile, getProfileByUserId } from '@/lib/profile/service';
import {
  canAnalyze,
  getRemainingAnalyses,
  formatPlanLabel,
  formatStatusLabel,
  formatRemainingLabel,
} from '@/lib/entitlements';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let profile = await getProfileByUserId(supabase, user.id);
  if (!profile) {
    profile = await ensureProfile(supabase, user.id, user.email);
  }

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    profile,
    canAnalyze: canAnalyze(profile),
    remaining: getRemainingAnalyses(profile),
    labels: {
      plan: formatPlanLabel(profile),
      status: formatStatusLabel(profile),
      remaining: formatRemainingLabel(profile),
    },
  });
}
