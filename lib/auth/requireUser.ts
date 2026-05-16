import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export async function requireUser(): Promise<
  { user: User } | { error: Response }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  return { user };
}
