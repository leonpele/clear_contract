'use client';

import { useCallback, useMemo, useState } from 'react';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { buildClauseHighlights } from '@/lib/clauseHighlights';
import { HighlightLegend } from './HighlightLegend';
import { HighlightedContractText } from './HighlightedContractText';
import { ClauseExplanationCard } from './ClauseExplanationCard';
import { Card } from '@/components/ui/Card';

interface ContractHighlightSectionProps {
  contractText: string;
  results: AnalysisResult;
}

export function ContractHighlightSection({
  contractText,
  results,
}: ContractHighlightSectionProps) {
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);

  const highlights = useMemo(
    () => buildClauseHighlights(contractText, results),
    [contractText, results]
  );

  const scrollToExplanation = useCallback((id: string) => {
    setActiveClauseId(id);
    requestAnimationFrame(() => {
      document
        .getElementById(`explanation-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, []);

  const handleExplanationClick = useCallback((id: string) => {
    setActiveClauseId(id);
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-clause-id="${id}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  return (
    <div className="space-y-6">
      <HighlightLegend />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
        <div className="min-w-0 space-y-2">
          <p className="label-caps">Original contract</p>
          <Card className="p-0 overflow-hidden shadow-none">
            <HighlightedContractText
              contractText={contractText}
              highlights={highlights}
              activeClauseId={activeClauseId}
              onClauseClick={scrollToExplanation}
            />
          </Card>
        </div>

        <div className="min-w-0 flex flex-col gap-2 max-h-[min(65vh,520px)]">
          <p className="label-caps shrink-0">Explanations</p>
          <div className="space-y-3 overflow-y-auto overflow-x-hidden pr-1 flex-1 min-h-0">
            {highlights.length === 0 ? (
              <Card muted>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Quotes from the analysis could not be matched in your pasted
                  text. Ensure the contract wording matches exactly, or paste
                  the full clause text.
                </p>
              </Card>
            ) : (
              highlights.map((h) => (
                <ClauseExplanationCard
                  key={h.id}
                  highlight={h}
                  isActive={activeClauseId === h.id}
                  onSelect={() => handleExplanationClick(h.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
