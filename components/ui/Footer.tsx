import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/60 backdrop-blur-sm">
      <div className="mx-auto max-w-wide px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-white">
              CC
            </span>
            ContractClear
          </div>

          {/* Legal */}
          <nav className="flex flex-wrap items-center gap-4 text-xs text-ink-faint">
            <Link href="/mentions-legales" className="hover:text-ink-muted transition-colors duration-150">
              Mentions légales
            </Link>
            <Link href="/cgu" className="hover:text-ink-muted transition-colors duration-150">
              CGU/CGV
            </Link>
            <Link href="/confidentialite" className="hover:text-ink-muted transition-colors duration-150">
              Confidentialité
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} ContractClear. Not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
