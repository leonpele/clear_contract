'use client';

import PricingCard from '@/components/PricingCard';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/entitlements';
import { PRICING_PLANS } from '@/lib/stripe';
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
              <PricingCard
                name={PRICING_PLANS.oneTime.name}
                price={PRICING_PLANS.oneTime.price}
                description={`${PRICING_PLANS.oneTime.description}, one payment`}
                features={PRICING_PLANS.oneTime.features}
                checkoutHref="/checkout?plan=one-time"
                ctaLabel="Choose plan"
              />
            </FadeIn>

            <FadeIn delay={100}>
              <PricingCard
                name={PRICING_PLANS.subscription.name}
                price={PRICING_PLANS.subscription.price}
                period="/mo"
                description={PRICING_PLANS.subscription.description}
                features={PRICING_PLANS.subscription.features}
                highlighted
                checkoutHref="/checkout?plan=subscription"
                ctaLabel="Subscribe"
              />
            </FadeIn>
          </div>
        </section>

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
