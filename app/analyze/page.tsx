'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone from '@/components/UploadZone';
import ResultsPanel from '@/components/ResultsPanel';
import PaywallModal from '@/components/PaywallModal';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { AppHeader } from '@/components/ui/AppHeader';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Section, SectionDivider } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { PageBackground } from '@/components/ui/PageBackground';
import { FadeIn } from '@/components/ui/FadeIn';
import { createClient } from '@/lib/supabase/client';
import { MAX_CONTRACT_CHARS } from '@/lib/limits';

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

    if (contractText.length > MAX_CONTRACT_CHARS) {
      setError(
        `Contract text exceeds ${MAX_CONTRACT_CHARS.toLocaleString('en-US')} characters`
      );
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
      <div className="relative min-h-screen flex items-center justify-center">
        <PageBackground variant="analyze" />
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-ink-muted animate-pulse-soft">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground variant="analyze" />
      <AppHeader
        action={
          profileInfo ? (
            <span className="hidden sm:inline rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-ink-muted backdrop-blur-sm">
              {profileInfo.labels.plan} · {profileInfo.labels.remaining} left
            </span>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-wide px-5 py-10 sm:px-8 sm:py-14">
        <FadeIn>
          <div className="mb-10 max-w-content">
            <h1 className="mb-2">Analyze your contract</h1>
            <p className="prose-body">
              Upload a PDF or paste text. We highlight risks and explain each
              clause in plain language.
            </p>
            <LegalDisclaimer className="mt-4" />
          </div>
        </FadeIn>

        <Section
          title="Contract upload"
          subtitle="PDF or pasted text, up to 50,000 characters."
          animate
        >
          <Card className="space-y-5 shadow-card-hover">
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
              className={`input-field resize-none leading-relaxed transition-all duration-300 ${
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
                className="rounded-lg border border-risk-high-border bg-risk-high-bg px-4 py-3 text-sm text-risk-high animate-fade-in"
                role="alert"
              >
                {error}
              </p>
            )}
          </Card>
        </Section>

        {results && (
          <div className="mt-4 space-y-0 animate-fade-up">
            <SectionDivider />
            <ResultsPanel results={results} contractText={contractText} />
          </div>
        )}

        {!results && (
          <Card muted className="mt-12 text-center py-14 border-dashed">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border">
              <svg className="h-5 w-5 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ink-secondary mb-1">
              Results will appear here
            </p>
            <p className="text-ink-muted text-xs leading-relaxed max-w-xs mx-auto">
              Risk score, summary, and highlighted clauses — after you analyze a contract above.
            </p>
          </Card>
        )}
      </main>

      <Footer />

      {showPaywall && (
        <PaywallModal onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
