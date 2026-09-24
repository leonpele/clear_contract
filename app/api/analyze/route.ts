import {
  canAnalyze,
  effectiveAnalysesUsed,
} from '@/lib/entitlements';
import { MAX_CONTRACT_CHARS } from '@/lib/limits';
import {
  ensureProfile,
  incrementAnalysisUsage,
  saveAnalysisHistory,
  syncUsageMonth,
} from '@/lib/profile/service';
import {
  AnalysisConfigError,
  AnalysisParseError,
  analyzeContract,
} from '@/lib/analysis/analyzeContract';
import {
  GUEST_COOKIE,
  GUEST_COOKIE_MAX_AGE_S,
  buildGuestPreview,
  hashClientIp,
  isGuestRateLimited,
  saveGuestAnalysis,
} from '@/lib/analysis/guest';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { track, trackFirstDocumentUploaded } from '@/lib/analytics/track';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface AnalysisRequest {
  text: string;
}

/** Validated contract text, or the 400 response to send back. */
async function readContractText(
  request: NextRequest
): Promise<{ text: string } | { error: NextResponse }> {
  const body = (await request.json()) as AnalysisRequest;
  const { text } = body;

  if (!text || text.trim().length === 0) {
    return {
      error: NextResponse.json(
        { error: 'Contract text is required' },
        { status: 400 }
      ),
    };
  }

  if (text.length > MAX_CONTRACT_CHARS) {
    return {
      error: NextResponse.json(
        {
          error: `Contract text exceeds ${MAX_CONTRACT_CHARS.toLocaleString('en-US')} characters`,
        },
        { status: 400 }
      ),
    };
  }

  return { text };
}

/**
 * Visitor without an account: the contract really is analyzed, but the result
 * stays server-side. The visitor gets a locked preview and a cookie; signing
 * up and calling /api/analyze/claim releases the full result.
 */
async function handleGuestAnalysis(request: NextRequest) {
  const admin = createAdminClient();
  const ipHash = hashClientIp(request.headers);

  if (await isGuestRateLimited(admin, ipHash)) {
    return NextResponse.json(
      {
        error:
          'Free analysis limit reached for today. Create an account to keep analyzing.',
        code: 'GUEST_LIMIT',
      },
      { status: 429 }
    );
  }

  const input = await readContractText(request);
  if ('error' in input) return input.error;

  const analysis = await analyzeContract(input.text);
  const guestId = await saveGuestAnalysis(admin, ipHash, input.text, analysis);

  if (!guestId) {
    return NextResponse.json(
      { error: 'Could not save your analysis. Please try again.' },
      { status: 500 }
    );
  }

  const response = NextResponse.json(buildGuestPreview(analysis));
  response.cookies.set(GUEST_COOKIE, guestId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: GUEST_COOKIE_MAX_AGE_S,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return await handleGuestAnalysis(request);
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

    const input = await readContractText(request);
    if ('error' in input) return input.error;
    const { text } = input;

    await trackFirstDocumentUploaded(admin, user.id);

    const analysis = await analyzeContract(text);

    await incrementAnalysisUsage(admin, profile);
    await saveAnalysisHistory(admin, user.id, text, analysis);
    await track(admin, user.id, 'analysis_completed', {
      risk_score: analysis.risk_score.percentage,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in /api/analyze:', error);

    if (error instanceof AnalysisConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    if (error instanceof AnalysisParseError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
