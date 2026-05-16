'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LinkButton } from '@/components/ui/LinkButton';
import { Button } from '@/components/ui/Button';

export function AuthNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <span className="text-sm text-ink-muted">…</span>;
  }

  if (!email) {
    return (
      <div className="flex items-center gap-2">
        <LinkButton href="/login" variant="ghost" className="text-sm">
          Sign in
        </LinkButton>
        <LinkButton href="/signup" className="text-sm">
          Sign up
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/account"
        className="hidden sm:inline text-sm text-ink-muted hover:text-ink truncate max-w-[160px]"
      >
        {email}
      </Link>
      <LinkButton href="/account" variant="ghost" className="text-sm">
        Account
      </LinkButton>
      <Button type="button" variant="ghost" className="text-sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
