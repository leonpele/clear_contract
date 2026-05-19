import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureProfile } from '@/lib/profile/service';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('redirect') ?? '/account';

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

      const path = next.startsWith('/') ? next : `/${next}`;
      return NextResponse.redirect(`${origin}${path}`);
    }
    console.error('auth/callback exchangeCodeForSession:', error.message);
  }

  return NextResponse.redirect(
    `${origin}/login?error=auth&redirect=${encodeURIComponent(next)}`
  );
}
