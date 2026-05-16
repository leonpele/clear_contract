'use client';

import { Button } from '@/components/ui/Button';

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <Button type="button" variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
}
