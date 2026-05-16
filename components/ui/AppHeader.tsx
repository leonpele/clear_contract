import Link from 'next/link';
import { AuthNav } from '@/components/auth/AuthNav';

interface AppHeaderProps {
  /** Extra controls shown before Sign in / Account (e.g. Get started) */
  action?: React.ReactNode;
  /** Set false on auth pages if you want a minimal header */
  showAuth?: boolean;
}

export function AppHeader({ action, showAuth = true }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-ink">
          ContractClear
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {action}
          {showAuth && <AuthNav />}
        </div>
      </div>
    </header>
  );
}
