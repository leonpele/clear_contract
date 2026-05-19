import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ensureProfile, getProfileByUserId } from '@/lib/profile/service';
import {
  formatPlanLabel,
  formatStatusLabel,
  formatRemainingLabel,
  canAnalyze,
} from '@/lib/entitlements';
import { AppHeader } from '@/components/ui/AppHeader';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  let profile = await getProfileByUserId(supabase, user.id);
  if (!profile) {
    profile = await ensureProfile(supabase, user.id, user.email);
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-surface">
        <AppHeader />
        <main className="mx-auto max-w-content px-5 py-12">
          <p className="text-risk-high">
            Could not load your profile. Run the SQL migration in Supabase
            (see <code className="text-xs">supabase/migrations/001_profiles_and_analyses.sql</code>
            ) and set <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code> in
            your environment, then sign out and sign in again.
          </p>
        </main>
      </div>
    );
  }

  const purchaseLabel =
    profile.purchase_type === 'one-time' ? 'One-time' : '—';

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
        <h1 className="mb-2">Account</h1>
        <p className="prose-body text-sm mb-8">
          Your plan, usage, and subscription details.
        </p>

        <Card className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="label-caps text-ink-muted">Email</dt>
              <dd className="mt-1 text-ink">{user.email}</dd>
            </div>
            <div>
              <dt className="label-caps text-ink-muted">Plan</dt>
              <dd className="mt-1 text-ink font-medium">
                {formatPlanLabel(profile)}
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-muted">Status</dt>
              <dd className="mt-1 text-ink">{formatStatusLabel(profile)}</dd>
            </div>
            <div>
              <dt className="label-caps text-ink-muted">Remaining analyses</dt>
              <dd className="mt-1 text-ink font-medium">
                {formatRemainingLabel(profile)}
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-muted">Purchase type</dt>
              <dd className="mt-1 text-ink">{purchaseLabel}</dd>
            </div>
            <div>
              <dt className="label-caps text-ink-muted">Used this period</dt>
              <dd className="mt-1 text-ink tabular-nums">
                {profile.analyses_used} / {profile.analyses_limit}
              </dd>
            </div>
          </dl>

          {!canAnalyze(profile) && (
            <p className="text-sm text-ink-secondary rounded-lg border border-border bg-surface-muted px-4 py-3">
              You&apos;ve reached your analysis limit. Upgrade to continue.
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton href="/premium">Upgrade</LinkButton>
            <LinkButton href="/analyze" variant="secondary">
              Analyze contract
            </LinkButton>
            <LinkButton href="/history" variant="ghost">
              History
            </LinkButton>
            <LogoutButton />
          </div>
        </Card>

        <LegalDisclaimer className="mt-8" />
      </main>
    </div>
  );
}
