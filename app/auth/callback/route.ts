import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureProfile } from '@/lib/profile/service';

function safeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/analyze';
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeRedirectPath(searchParams.get('redirect'));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        try {
          const admin = createAdminClient();
          await ensureProfile(admin, user.id, user.email);
        } catch (profileErr) {
          console.error('auth/callback ensureProfile:', profileErr);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('auth/callback exchangeCodeForSession:', error.message);
  }

  return NextResponse.redirect(
    `${origin}/login?error=auth&redirect=${encodeURIComponent(next)}`
  );
}
