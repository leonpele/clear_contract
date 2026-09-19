import { NextRequest, NextResponse } from 'next/server';
import { canAnalyze, effectiveAnalysesUsed } from '@/lib/entitlements';
import {
  ensureProfile,
  incrementAnalysisUsage,
  saveAnalysisHistory,
  syncUsageMonth,
} from '@/lib/profile/service';
import {
  GUEST_COOKIE,
  claimGuestAnalysis,
  isValidGuestId,
} from '@/lib/analysis/guest';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { track, trackFirstDocumentUploaded } from '@/lib/analytics/track';

/**
 * Releases the analysis a visitor ran before signing up. Counts as one of the
 * new member's analyses, exactly as if they had run it while signed in.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Sign in required to view this analysis.' },
        { status: 401 }
      );
    }

    const guestId = request.cookies.get(GUEST_COOKIE)?.value;
    if (!isValidGuestId(guestId)) {
      return NextResponse.json(
        { error: 'No pending analysis found.' },
        { status: 404 }
      );
    }

    let profile = await ensureProfile(supabase, user.id, user.email);
    if (!profile) {
      return NextResponse.json(
        { error: 'Could not load your account profile.' },
        { status: 500 }
      );
    }

    const admin = createAdminClient();
    profile = await syncUsageMonth(admin, profile);

    if (!canAnalyze(profile)) {
      // Leave the analysis unclaimed so it is still there after upgrading.
      return NextResponse.json(
        {
          error: 'Analysis limit reached. Upgrade to continue.',
          code: 'LIMIT_EXCEEDED',
          used: effectiveAnalysesUsed(profile),
          limit: profile.analyses_limit,
        },
        { status: 402 }
      );
    }

    const claimed = await claimGuestAnalysis(admin, guestId, user.id);
    if (!claimed) {
      const gone = NextResponse.json(
        { error: 'This analysis is no longer available.' },
        { status: 404 }
      );
      gone.cookies.delete(GUEST_COOKIE);
      return gone;
    }

    await trackFirstDocumentUploaded(admin, user.id);
    await incrementAnalysisUsage(admin, profile);
    await saveAnalysisHistory(
      admin,
      user.id,
      claimed.contractText,
      claimed.analysis
    );
    await track(admin, user.id, 'analysis_completed', {
      risk_score: claimed.analysis.risk_score.percentage,
      source: 'guest_claim',
    });

    const response = NextResponse.json({
      analysis: claimed.analysis,
      contractText: claimed.contractText,
    });
    response.cookies.delete(GUEST_COOKIE);
    return response;
  } catch (error) {
    console.error('Error in /api/analyze/claim:', error);
    return NextResponse.json(
      { error: 'Could not load your analysis.' },
      { status: 500 }
    );
  }
}
