'use client';

import type { ClauseHighlight } from '@/lib/analysisTypes';
import { explanationCardClass } from './highlightStyles';

interface ClauseExplanationCardProps {
  highlight: ClauseHighlight;
  isActive: boolean;
  onSelect: () => void;
}

const severityLabel: Record<ClauseHighlight['severity'], string> = {
  high: 'High risk',
  warning: 'Warning',
  info: 'Important',
};

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
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-medium text-ink">{highlight.title}</h4>
        <span className="label-caps shrink-0 normal-case tracking-normal text-[11px]">
          {severityLabel[highlight.severity]}
        </span>
      </div>
      <blockquote className="mb-3 border-l-2 border-border pl-3 text-sm italic text-ink-muted leading-relaxed">
        &ldquo;{highlight.quote}&rdquo;
      </blockquote>
      <p className="text-sm leading-relaxed text-ink-secondary">
        <span className="font-medium text-ink">{label}:</span>{' '}
        {highlight.explanation}
      </p>
    </article>
  );
}
