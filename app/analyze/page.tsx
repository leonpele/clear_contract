'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone from '@/components/UploadZone';
import ResultsPanel from '@/components/ResultsPanel';
import PaywallModal from '@/components/PaywallModal';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { AppHeader } from '@/components/ui/AppHeader';
import { AuthNav } from '@/components/auth/AuthNav';
import { Button } from '@/components/ui/Button';
import { Section, SectionDivider } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { createClient } from '@/lib/supabase/client';

interface ProfileResponse {
  canAnalyze: boolean;
  remaining: number | 'unlimited';
  labels: { plan: string; remaining: string };
}

export default function AnalyzePage() {
  const router = useRouter();
  const [contractText, setContractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace('/login?redirect=/analyze');
        return;
      }
      setAuthChecked(true);
      fetch('/api/profile')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setProfileInfo(data);
        })
        .catch(() => {});
    });
  }, [router]);

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError('Please paste or upload contract text');
      return;
    }

    if (contractText.length > 50000) {
      setError('Contract text exceeds 50,000 characters');
      return;
    }

    if (profileInfo && !profileInfo.canAnalyze) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: contractText }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push('/login?redirect=/analyze');
        return;
      }

      if (response.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }

      setResults(data as AnalysisResult);

      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const updated = await profileRes.json();
        setProfileInfo(updated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader
        action={
          <div className="flex items-center gap-3">
            {profileInfo && (
              <span className="hidden sm:inline text-xs text-ink-muted">
                {profileInfo.labels.plan} · {profileInfo.labels.remaining}{' '}
                left
              </span>
            )}
            <AuthNav />
          </div>
        }
      />

      <main className="mx-auto max-w-wide px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 max-w-content">
          <h1 className="mb-2">Analyze your contract</h1>
          <p className="prose-body">
            Upload a PDF or paste text. We highlight risks and explain each
            clause in plain language.
          </p>
          <LegalDisclaimer className="mt-4" />
        </div>

        <Section
          title="Contract upload"
          subtitle="PDF or pasted text, up to 50,000 characters."
        >
          <Card className="space-y-5">
            <UploadZone
              onTextExtracted={setContractText}
              currentText={contractText}
            />

            <textarea
              value={contractText}
              onChange={(e) => {
                setContractText(e.target.value);
                setError('');
              }}
              placeholder="Paste contract text here…"
              className={`w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink placeholder:text-ink-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow duration-200 ${
                results ? 'min-h-[140px]' : 'min-h-[220px]'
              }`}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-muted tabular-nums">
                {contractText.length.toLocaleString()} / 50,000
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={loading || !contractText.trim()}
                className="sm:min-w-[180px]"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing…
                  </>
                ) : (
                  'Analyze contract'
                )}
              </Button>
            </div>

            {error && (
              <p
                className="rounded-lg border border-risk-high-border bg-risk-high-bg px-4 py-3 text-sm text-risk-high"
                role="alert"
              >
                {error}
              </p>
            )}
          </Card>
        </Section>

        {results && (
          <div className="mt-4 space-y-0">
            <SectionDivider />
            <ResultsPanel results={results} contractText={contractText} />
          </div>
        )}

        {!results && (
          <Card muted className="mt-12 text-center py-12">
            <p className="text-ink-muted text-sm leading-relaxed max-w-sm mx-auto">
              Your risk score, summary, and highlighted clauses will appear here
              after analysis.
            </p>
          </Card>
        )}
      </main>

      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
