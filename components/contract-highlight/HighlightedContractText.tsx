'use client';

import { useMemo } from 'react';
import type { ClauseHighlight } from '@/lib/analysisTypes';
import { buildTextSegments } from '@/lib/clauseHighlights';
import { highlightClassName } from './highlightStyles';

interface HighlightedContractTextProps {
  contractText: string;
  highlights: ClauseHighlight[];
  activeClauseId: string | null;
  onClauseClick: (id: string) => void;
}

export function HighlightedContractText({
  contractText,
  highlights,
  activeClauseId,
  onClauseClick,
}: HighlightedContractTextProps) {
  const segments = useMemo(
    () => buildTextSegments(contractText, highlights),
    [contractText, highlights]
  );

  if (highlights.length === 0) {
    return (
      <p className="p-5 text-sm text-ink-muted leading-relaxed">
        No passages could be matched for highlighting. Review the summary and
        recommendations above.
      </p>
    );
  }

  return (
    <div
      className="text-[14px] leading-7 text-ink-secondary whitespace-pre-wrap break-words max-h-[min(65vh,520px)] overflow-y-auto p-5"
      role="document"
      aria-label="Contract with highlighted clauses"
    >
      {segments.map((seg, i) =>
        seg.type === 'plain' ? (
          <span key={i}>{seg.text}</span>
        ) : (
          <button
            key={seg.highlight.id}
            type="button"
            data-clause-id={seg.highlight.id}
            onClick={() => onClauseClick(seg.highlight.id)}
            className={highlightClassName(
              seg.highlight.severity,
              activeClauseId === seg.highlight.id
            )}
            title={`${seg.highlight.title}: view explanation`}
            aria-label={`${seg.highlight.title}. Click to see explanation.`}
            aria-current={
              activeClauseId === seg.highlight.id ? 'true' : undefined
            }
          >
            {seg.text}
          </button>
        )
      )}
    </div>
  );
}
