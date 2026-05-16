import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/ui/AppHeader';
import { AuthNav } from '@/components/auth/AuthNav';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/LinkButton';
import type { ContractAnalysisRow } from '@/lib/types/profile';

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/history');
  }

  const { data: rows, error } = await supabase
    .from('contract_analyses')
    .select('id, contract_preview, risk_score_percentage, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const analyses = (rows ?? []) as Pick<
    ContractAnalysisRow,
    'id' | 'contract_preview' | 'risk_score_percentage' | 'created_at'
  >[];

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader action={<AuthNav />} />
      <main className="mx-auto max-w-wide px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2">Analysis history</h1>
            <p className="prose-body text-sm">
              Your past contract analyses.
            </p>
          </div>
          <LinkButton href="/analyze" variant="secondary">
            New analysis
          </LinkButton>
        </div>

        {error && (
          <p className="text-risk-high text-sm mb-4">
            Could not load history. Run the Supabase migration.
          </p>
        )}

        {analyses.length === 0 ? (
          <Card muted className="text-center py-12">
            <p className="text-sm text-ink-muted">No analyses yet.</p>
            <LinkButton href="/analyze" className="mt-4">
              Analyze a contract
            </LinkButton>
          </Card>
        ) : (
          <ul className="space-y-3">
            {analyses.map((row) => (
              <li key={row.id}>
                <Card className="shadow-none">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-ink-muted mb-1">
                        {new Date(row.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-ink-secondary line-clamp-2">
                        {row.contract_preview || 'Contract analysis'}
                      </p>
                    </div>
                    {row.risk_score_percentage != null && (
                      <span className="text-sm font-medium tabular-nums text-ink">
                        Risk {row.risk_score_percentage}%
                      </span>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-sm text-ink-muted">
          <Link href="/account" className="text-primary hover:text-primary-hover">
            Back to account
          </Link>
        </p>
      </main>
    </div>
  );
}
