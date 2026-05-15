'use client';

import { useState, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import ResultsPanel from '@/components/ResultsPanel';
import PaywallModal from '@/components/PaywallModal';
import {
  parseUsage,
  incrementUsage,
  isPaidUser,
  setPaidUser,
  FREE_ANALYSES_PER_MONTH,
} from '@/lib/parseUsage';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/LinkButton';
import { Section, SectionDivider } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

export default function AnalyzePage() {
  const [contractText, setContractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const count = parseUsage();
    setUsageCount(count);
    setPaid(isPaidUser());
  }, []);

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError('Please paste or upload contract text');
      return;
    }

    if (contractText.length > 50000) {
      setError('Contract text exceeds 50,000 characters');
      return;
    }

    if (!paid && usageCount >= FREE_ANALYSES_PER_MONTH) {
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

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      incrementUsage();
      setUsageCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaidUser();
    setPaid(true);
    setShowPaywall(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader
        action={
          <LinkButton href="/" variant="ghost" className="text-sm">
            Home
          </LinkButton>
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
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
