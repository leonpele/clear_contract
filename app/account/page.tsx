import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  ensureProfile,
  getProfileByUserId,
  syncUsageMonth,
} from '@/lib/profile/service';
import { isAdminEmail } from '@/lib/admin';
import {
  formatPlanLabel,
  formatStatusLabel,
  formatRemainingLabel,
  canAnalyze,
  effectiveAnalysesUsed,
  effectiveAnalysesLimit,
} from '@/lib/entitlements';
import { AppHeader } from '@/components/ui/AppHeader';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { DeleteAccountButton } from '@/components/auth/DeleteAccountButton';
import { PageBackground } from '@/components/ui/PageBackground';
import { FadeIn } from '@/components/ui/FadeIn';

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

  try {
    const admin = createAdminClient();
    profile = await syncUsageMonth(admin, profile);
  } catch (err) {
    console.error('account syncUsageMonth:', err);
  }

  const purchaseLabel =
    profile.purchase_type === 'one-time' ? 'One-time' : '—';
  const used = effectiveAnalysesUsed(profile);
  const limit = effectiveAnalysesLimit(profile);

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <AppHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
        <FadeIn>
        <h1 className="mb-2">Account</h1>
        <p className="prose-body text-sm mb-8">
          Your plan, usage, and subscription details.
        </p>
        </FadeIn>

        <FadeIn delay={80}>
        <Card className="space-y-6 shadow-card-hover">
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
                {used} / {limit}
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
            {isAdminEmail(user.email) && (
              <LinkButton href="/admin" variant="ghost">
                Dashboard
              </LinkButton>
            )}
            <LogoutButton />
          </div>
        </Card>
        </FadeIn>

        <FadeIn delay={120}>
        <div className="mt-6 text-right">
          <DeleteAccountButton />
        </div>
        </FadeIn>

        <LegalDisclaimer className="mt-8" />
      </main>

      <Footer />
    </div>
  );
}
