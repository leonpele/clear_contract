'use client';

import type { ClauseHighlight } from '@/lib/analysisTypes';
import { explanationCardClass } from './highlightStyles';

interface ClauseExplanationCardProps {
  highlight: ClauseHighlight;
  isActive: boolean;
  onSelect: () => void;
}

export function ClauseExplanationCard({
  highlight,
  isActive,
  onSelect,
}: ClauseExplanationCardProps) {
  const label =
    highlight.category === 'risk'
      ? "Why it's risky"
      : highlight.category === 'favorable'
        ? "Why it's favorable"
        : 'Detail';

  return (
    <article
      id={`explanation-${highlight.id}`}
      className={explanationCardClass(highlight.severity, isActive)}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-gray-900">
          {highlight.title}
        </h4>
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
          {highlight.severity === 'high'
            ? 'High risk'
            : highlight.severity === 'warning'
              ? 'Warning'
              : 'Important'}
        </span>
      </div>
      <p className="text-sm text-gray-600 italic mb-2 border-l-2 border-gray-300 pl-2 line-clamp-3">
        &ldquo;{highlight.quote}&rdquo;
      </p>
      <p className="text-sm text-gray-700">
        <strong>{label}:</strong> {highlight.explanation}
      </p>
    </article>
  );
}
