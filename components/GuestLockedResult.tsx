import type { GuestAnalysisPreview } from '@/lib/analysisTypes';
import { FREE_ANALYSES_PER_MONTH } from '@/lib/entitlements';
import { RiskLevelBadge } from '@/components/contract-risk/RiskLevelBadge';
import { LinkButton } from '@/components/ui/LinkButton';
import { Card } from '@/components/ui/Card';

/** Where a visitor lands after signing up: the analyze page picks the pending result up. */
const CLAIM_REDIRECT = '/analyze?claim=1';

interface GuestLockedResultProps {
  preview: GuestAnalysisPreview;
}

/** Shown to a visitor without an account: the verdict is teased, the detail is locked. */
export function GuestLockedResult({ preview }: GuestLockedResultProps) {
  const redirect = encodeURIComponent(CLAIM_REDIRECT);
  const count = preview.risky_clause_count;

  return (
    <Card className="relative mt-12 overflow-hidden shadow-card-hover">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-ink">Your analysis is ready</h2>
        <RiskLevelBadge level={preview.risk_level} />
      </div>

      <p className="mb-6 text-sm text-ink-secondary">
        {count > 0
          ? `We found ${count} risky ${count === 1 ? 'clause' : 'clauses'} in your contract.`
          : 'No clause was flagged as risky in your contract.'}{' '}
        Create a free account to see the risk score, the summary and every
        highlighted clause.
      </p>

      {/* Placeholder only: the real content never leaves the server before sign-up. */}
      <div
        aria-hidden
        className="pointer-events-none mb-6 select-none space-y-3 blur-sm"
      >
        <div className="h-4 w-1/3 rounded bg-surface-muted" />
        <div className="h-3 w-full rounded bg-surface-muted" />
        <div className="h-3 w-11/12 rounded bg-surface-muted" />
        <div className="h-3 w-4/5 rounded bg-surface-muted" />
        <div className="h-16 w-full rounded-lg border border-border bg-surface-muted" />
        <div className="h-16 w-full rounded-lg border border-border bg-surface-muted" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <LinkButton
          href={`/signup?redirect=${redirect}`}
          className="sm:min-w-[220px]"
        >
          Create a free account to see results
        </LinkButton>
        <LinkButton href={`/login?redirect=${redirect}`} variant="secondary">
          I already have an account
        </LinkButton>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        Free plan: {FREE_ANALYSES_PER_MONTH} analyses per month. No credit card
        required.
      </p>
    </Card>
  );
}
