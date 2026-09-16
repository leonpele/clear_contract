'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthNav } from '@/components/auth/AuthNav';

interface AppHeaderProps {
  action?: React.ReactNode;
  showAuth?: boolean;
}

const navLinks = [
  { href: '/analyze', label: 'Analyze' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/premium', label: 'Upgrade' },
];

export function AppHeader({ action, showAuth = true }: AppHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-wide items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-base font-semibold tracking-tight text-ink transition-opacity duration-200 hover:opacity-80"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            CC
          </span>
          <span>ContractClear</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {action}
          {showAuth && <AuthNav />}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="btn-interactive md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface hover:bg-surface-muted"
          >
            {mobileOpen ? (
              <svg className="h-4 w-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-border/70 bg-surface/95 backdrop-blur-md animate-fade-in"
        >
          <div className="mx-auto max-w-wide px-5 py-3 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface-muted hover:text-ink transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
