import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Deletes the signed-in user's auth.users row. profiles, contract_analyses,
 * and analytics_events all have ON DELETE CASCADE back to it, so this is
 * the single source of truth for account deletion — no other cleanup needed.
 */
export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error('account/delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }

  try {
    await supabase.auth.signOut();
  } catch (signOutErr) {
    console.error('account/delete signOut:', signOutErr);
  }

  return NextResponse.json({ success: true });
}
