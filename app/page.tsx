'use client';

import Link from 'next/link';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/parseUsage';
import { AppHeader } from '@/components/ui/AppHeader';
import { LinkButton } from '@/components/ui/LinkButton';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

const features = [
  {
    title: 'Spot risky clauses',
    description:
      'AI flags problematic terms and explains why they matter in plain language.',
  },
  {
    title: 'Plain-language summary',
    description:
      'Legal jargon translated into clear explanations you can act on.',
  },
  {
    title: 'Key numbers extracted',
    description:
      'Important dates, amounts, and durations surfaced in one place.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <AppHeader
        action={<LinkButton href="/analyze">Get started</LinkButton>}
      />

      <main>
        <section className="mx-auto max-w-content px-5 py-16 sm:px-8 sm:py-24 text-center">
          <h1 className="mb-5 text-3xl sm:text-4xl">
            Understand any contract in minutes
          </h1>
          <p className="prose-body mx-auto max-w-lg mb-8">
            Upload your PDF or paste your text. We highlight risks, explain
            jargon, and surface what actually matters before you sign.
          </p>
          <LinkButton href="/analyze" className="px-6 py-3 text-base">
            Analyze your contract
          </LinkButton>
          <LegalDisclaimer className="mt-8 max-w-md mx-auto" />
        </section>

        <section className="border-t border-border bg-surface-muted">
          <div className="mx-auto max-w-wide px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} className="shadow-none">
                  <h3 className="mb-2">{f.title}</h3>
                  <p className="prose-body text-sm">{f.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-wide px-5 py-16 sm:px-8 sm:py-20" id="pricing">
          <h2 className="text-center mb-3">Simple pricing</h2>
          <p className="text-center prose-body text-sm mb-12 max-w-md mx-auto">
            {FREE_ANALYSES_PER_MONTH} free analyses every month. Upgrade when you
            need more.
          </p>
          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            <Card>
              <h3 className="mb-1">One-time</h3>
              <p className="text-3xl font-semibold text-ink mb-1">€3</p>
              <p className="text-sm text-ink-muted mb-6">5 analyses, one payment</p>
              <ul className="space-y-2 text-sm text-ink-secondary mb-8">
                <li>5 contract analyses</li>
                <li>Full risk assessment</li>
                <li>PDF and text support</li>
              </ul>
              <LinkButton
                href="/checkout?plan=one-time"
                variant="secondary"
                className="w-full"
              >
                Choose plan
              </LinkButton>
            </Card>

            <Card className="border-primary/30 ring-1 ring-primary/10">
              <p className="text-xs font-medium text-primary mb-2">Recommended</p>
              <h3 className="mb-1">Pro</h3>
              <p className="text-3xl font-semibold text-ink mb-1">
                €8<span className="text-base font-normal text-ink-muted">/mo</span>
              </p>
              <p className="text-sm text-ink-muted mb-6">Unlimited analyses</p>
              <ul className="space-y-2 text-sm text-ink-secondary mb-8">
                <li>Unlimited analyses</li>
                <li>Full risk assessment</li>
                <li>Cancel anytime</li>
              </ul>
              <LinkButton href="/checkout?plan=subscription" className="w-full">
                Subscribe
              </LinkButton>
            </Card>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-content px-5 py-14 sm:px-8 text-center">
            <h2 className="mb-3 text-xl">Ready to review your contract?</h2>
            <p className="prose-body text-sm mb-6">
              Start with {FREE_ANALYSES_PER_MONTH} free analyses this month.
            </p>
            <LinkButton href="/analyze">Analyze now</LinkButton>
          </div>
        </section>
      </main>
    </div>
  );
}
