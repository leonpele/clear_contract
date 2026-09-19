import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/admin';
import { AppHeader } from '@/components/ui/AppHeader';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { PageBackground } from '@/components/ui/PageBackground';
import { FadeIn } from '@/components/ui/FadeIn';

interface DashboardMetrics {
  total_accounts: number;
  activated_accounts: number;
  activation_rate: number;
  returning_accounts: number;
  retention_rate: number;
  total_documents: number;
  documents_per_account: number;
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="shadow-card-hover">
      <p className="label-caps text-ink-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-sm text-ink-secondary">{hint}</p>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/admin');
  if (!isAdminEmail(user.email)) redirect('/account');

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('get_dashboard_metrics');
  const metrics = (error ? null : (data as DashboardMetrics)) ?? null;

  if (error) console.error('AdminDashboardPage get_dashboard_metrics:', error);

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <AppHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
        <FadeIn>
          <h1 className="mb-2">Dashboard</h1>
          <p className="prose-body text-sm mb-8">
            Activation, rétention et usage — calculés à partir des 5
            événements produit (inscription, premier document déposé,
            analyse terminée, checkout, abonnement actif).
          </p>
        </FadeIn>

        {!metrics ? (
          <Card>
            <p className="text-risk-high">
              Impossible de charger les indicateurs pour le moment.
            </p>
          </Card>
        ) : (
          <FadeIn delay={80}>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile
                label="Activation"
                value={`${metrics.activation_rate}%`}
                hint={`${metrics.activated_accounts} / ${metrics.total_accounts} comptes ont terminé au moins une analyse`}
              />
              <StatTile
                label="Rétention"
                value={`${metrics.retention_rate}%`}
                hint={`${metrics.returning_accounts} / ${metrics.activated_accounts} comptes activés sont revenus faire une 2e analyse un autre jour`}
              />
              <StatTile
                label="Documents / compte"
                value={metrics.documents_per_account.toString()}
                hint={`${metrics.total_documents} documents analysés au total, sur ${metrics.total_accounts} comptes`}
              />
            </div>
          </FadeIn>
        )}
      </main>
      <Footer />
    </div>
  );
}
