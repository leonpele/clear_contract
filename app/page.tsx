'use client';

import { FREE_ANALYSES_PER_MONTH } from '@/lib/entitlements';
import { AppHeader } from '@/components/ui/AppHeader';
import { Footer } from '@/components/ui/Footer';
import { LinkButton } from '@/components/ui/LinkButton';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { PageBackground } from '@/components/ui/PageBackground';
import { FadeIn } from '@/components/ui/FadeIn';

const ShieldIcon = () => (
  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const features = [
  {
    title: 'Spot risky clauses',
    description:
      'AI flags problematic terms and explains why they matter in plain language.',
    icon: <ShieldIcon />,
  },
  {
    title: 'Plain-language summary',
    description:
      'Legal jargon translated into clear explanations you can act on.',
    icon: <DocumentIcon />,
  },
  {
    title: 'Key numbers extracted',
    description:
      'Important dates, amounts, and durations surfaced in one place.',
    icon: <KeyIcon />,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <PageBackground />
      <AppHeader
        action={<LinkButton href="/analyze">Get started</LinkButton>}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-content px-5 py-20 sm:px-8 sm:py-28 text-center">
          <p className="animate-hero mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-ink-muted shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-risk-low animate-pulse-soft" />
            {FREE_ANALYSES_PER_MONTH} free analyses every month
          </p>
          <h1
            className="animate-hero mb-5 text-3xl sm:text-4xl lg:text-[2.75rem] hero-gradient-text"
            style={{ animationDelay: '100ms' }}
          >
            Understand any contract in minutes
          </h1>
          <p
            className="animate-hero prose-body mx-auto max-w-lg mb-10"
            style={{ animationDelay: '200ms' }}
          >
            Upload your PDF or paste your text. We highlight risks, explain
            jargon, and surface what actually matters before you sign.
          </p>
          <div
            className="animate-hero flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            style={{ animationDelay: '320ms' }}
          >
            <LinkButton href="/analyze" className="px-7 py-3 text-base">
              Analyze your contract
            </LinkButton>
            <LinkButton href="/#pricing" variant="secondary" className="px-7 py-3 text-base">
              View pricing
            </LinkButton>
          </div>
          <LegalDisclaimer
            className="mt-10 max-w-md mx-auto animate-hero"
            style={{ animationDelay: '400ms' }}
          />
        </section>

        {/* Features */}
        <section className="border-t border-border/80 bg-surface/60 backdrop-blur-sm">
          <div className="mx-auto max-w-wide px-5 py-16 sm:px-8 sm:py-20">
            <FadeIn>
              <h2 className="text-center mb-3">How it works</h2>
              <p className="text-center prose-body text-sm mb-12 max-w-md mx-auto">
                Three steps from upload to clarity — no legal knowledge required.
              </p>
            </FadeIn>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <FadeIn key={f.title} delay={i * 80}>
                  <Card interactive className="h-full group">
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted transition-transform duration-300 group-hover:scale-110">
                      {f.icon}
                    </span>
                    <h3 className="mb-2">{f.title}</h3>
                    <p className="prose-body text-sm">{f.description}</p>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          className="mx-auto max-w-wide px-5 py-16 sm:px-8 sm:py-20"
          id="pricing"
        >
          <FadeIn>
            <h2 className="text-center mb-3">Simple pricing</h2>
            <p className="text-center prose-body text-sm mb-12 max-w-md mx-auto">
              {FREE_ANALYSES_PER_MONTH} free analyses every month. Upgrade when
              you need more.
            </p>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <FadeIn delay={0}>
              <Card interactive className="flex flex-col h-full">
                <h3 className="mb-1">One-time</h3>
                <p className="text-3xl font-semibold text-ink mb-1">€3</p>
                <p className="text-sm text-ink-muted mb-6">
                  5 analyses, one payment
                </p>
                <ul className="space-y-3 text-sm text-ink-secondary mb-8 flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckIcon /> 5 contract analyses
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon /> Full risk assessment
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon /> PDF and text support
                  </li>
                </ul>
                <LinkButton
                  href="/checkout?plan=one-time"
                  variant="secondary"
                  className="w-full"
                >
                  Choose plan
                </LinkButton>
              </Card>
            </FadeIn>

            <FadeIn delay={100}>
              <Card
                interactive
                className="border-primary/30 ring-1 ring-primary/15 shadow-glow flex flex-col h-full"
              >
                <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wide">
                  Recommended
                </p>
                <h3 className="mb-1">Pro</h3>
                <p className="text-3xl font-semibold text-ink mb-1">
                  €8
                  <span className="text-base font-normal text-ink-muted">
                    /mo
                  </span>
                </p>
                <p className="text-sm text-ink-muted mb-6">
                  Unlimited analyses
                </p>
                <ul className="space-y-3 text-sm text-ink-secondary mb-8 flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckIcon /> Unlimited analyses
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon /> Full risk assessment
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon /> Cancel anytime
                  </li>
                </ul>
                <LinkButton
                  href="/checkout?plan=subscription"
                  className="w-full"
                >
                  Subscribe
                </LinkButton>
              </Card>
            </FadeIn>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/80">
          <FadeIn>
            <div className="mx-auto max-w-content px-5 py-16 sm:px-8 text-center">
              <h2 className="mb-3 text-xl">Ready to review your contract?</h2>
              <p className="prose-body text-sm mb-8">
                Start with {FREE_ANALYSES_PER_MONTH} free analyses this month.
              </p>
              <LinkButton href="/analyze" className="px-6 py-3">
                Analyze now
              </LinkButton>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
