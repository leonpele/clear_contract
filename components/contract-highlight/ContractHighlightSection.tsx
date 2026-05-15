'use client';

import { useCallback, useMemo, useState } from 'react';
import type { AnalysisResult } from '@/lib/analysisTypes';
import { buildClauseHighlights } from '@/lib/clauseHighlights';
import { HighlightLegend } from './HighlightLegend';
import { HighlightedContractText } from './HighlightedContractText';
import { ClauseExplanationCard } from './ClauseExplanationCard';

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
    <section className="space-y-3" aria-labelledby="highlight-section-title">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h3
          id="highlight-section-title"
          className="font-semibold text-gray-900 text-lg"
        >
          Contract highlights
        </h3>
        <HighlightLegend />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
            Original text
          </p>
          <HighlightedContractText
            contractText={contractText}
            highlights={highlights}
            activeClauseId={activeClauseId}
            onClauseClick={scrollToExplanation}
          />
        </div>

        <div className="min-w-0 flex flex-col max-h-[min(70vh,560px)]">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium shrink-0">
            Explanations
          </p>
          <div className="space-y-3 overflow-y-auto overflow-x-hidden pr-1 flex-1">
            {highlights.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Quotes from the analysis could not be located in your pasted
                text. Try pasting the exact contract wording.
              </p>
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
    </section>
  );
}
