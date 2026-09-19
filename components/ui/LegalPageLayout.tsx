import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import { Footer } from './Footer';
import { PageBackground } from './PageBackground';
import { FadeIn } from './FadeIn';

interface LegalPageLayoutProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  updated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <AppHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
        <FadeIn>
          <h1 className="mb-2">{title}</h1>
          <p className="text-xs text-ink-muted mb-10">
            Dernière mise à jour : {updated}
          </p>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="legal-content space-y-8">{children}</div>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2>{title}</h2>
      <div className="prose-body space-y-3">{children}</div>
    </section>
  );
}
