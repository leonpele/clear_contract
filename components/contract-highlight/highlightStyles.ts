import type { ClauseSeverity } from '@/lib/analysisTypes';
import type { RiskLevel } from '@/lib/analysisTypes';

export const HIGHLIGHT_LEGEND: Array<{
  severity: ClauseSeverity;
  label: string;
  swatch: string;
}> = [
  {
    severity: 'high',
    label: 'High risk',
    swatch: 'bg-risk-high-bg border-risk-high-border',
  },
  {
    severity: 'warning',
    label: 'Warning',
    swatch: 'bg-risk-medium-bg border-risk-medium-border',
  },
  {
    severity: 'info',
    label: 'Important',
    swatch: 'bg-surface-subtle border-border',
  },
];

export function highlightClassName(
  severity: ClauseSeverity,
  isActive: boolean
): string {
  const base =
    'rounded px-0.5 cursor-pointer transition-colors duration-200 border-b border-transparent';

  const bySeverity: Record<ClauseSeverity, string> = {
    high:
      'bg-risk-high-bg/80 text-risk-high border-risk-high-border hover:bg-risk-high-bg',
    warning:
      'bg-risk-medium-bg/80 text-risk-medium border-risk-medium-border hover:bg-risk-medium-bg',
    info: 'bg-surface-subtle text-ink-secondary border-border hover:bg-surface-muted',
  };

  const active: Record<ClauseSeverity, string> = {
    high: 'ring-1 ring-risk-high-border bg-risk-high-bg',
    warning: 'ring-1 ring-risk-medium-border bg-risk-medium-bg',
    info: 'ring-1 ring-border-strong bg-surface-muted',
  };

  return `${base} ${bySeverity[severity]} ${isActive ? active[severity] : ''}`;
}

export function explanationCardClass(
  severity: ClauseSeverity,
  isActive: boolean
): string {
  const base =
    'p-4 rounded-lg border transition-all duration-200 scroll-mt-28 cursor-pointer';
  const map: Record<ClauseSeverity, string> = {
    high: 'border-risk-high-border bg-risk-high-bg/50 hover:bg-risk-high-bg',
    warning:
      'border-risk-medium-border bg-risk-medium-bg/50 hover:bg-risk-medium-bg',
    info: 'border-border bg-surface-muted hover:bg-surface-subtle',
  };
  const active = isActive
    ? 'ring-1 ring-border-strong shadow-card border-border-strong'
    : '';
  return `${base} ${map[severity]} ${active}`;
}

export const riskLevelStyles: Record<
  RiskLevel,
  { badge: string; bar: string; score: string }
> = {
  low: {
    badge: 'bg-risk-low-bg text-risk-low border-risk-low-border',
    bar: 'bg-risk-low',
    score: 'text-risk-low',
  },
  medium: {
    badge: 'bg-risk-medium-bg text-risk-medium border-risk-medium-border',
    bar: 'bg-risk-medium',
    score: 'text-risk-medium',
  },
  high: {
    badge: 'bg-risk-high-bg text-risk-high border-risk-high-border',
    bar: 'bg-risk-high',
    score: 'text-risk-high',
  },
};
