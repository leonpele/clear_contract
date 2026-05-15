import Link from 'next/link';

interface AppHeaderProps {
  action?: React.ReactNode;
}

export function AppHeader({ action }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight text-ink">
          ContractClear
        </Link>
        {action}
      </div>
    </header>
  );
}
