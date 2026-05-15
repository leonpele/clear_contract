import type { ClauseSeverity } from '@/lib/analysisTypes';

export const HIGHLIGHT_LEGEND: Array<{
  severity: ClauseSeverity;
  label: string;
  swatch: string;
}> = [
  { severity: 'high', label: 'High risk', swatch: 'bg-red-200 border-red-400' },
  {
    severity: 'warning',
    label: 'Warning',
    swatch: 'bg-amber-200 border-amber-400',
  },
  {
    severity: 'info',
    label: 'Important',
    swatch: 'bg-sky-200 border-sky-400',
  },
];

export function highlightClassName(
  severity: ClauseSeverity,
  isActive: boolean
): string {
  const base =
    'rounded-sm border-b-2 cursor-pointer transition-colors duration-150 underline-offset-2 decoration-2';

  const bySeverity: Record<ClauseSeverity, string> = {
    high:
      'bg-red-100/90 border-red-500 text-red-950 hover:bg-red-200 decoration-red-500',
    warning:
      'bg-amber-100/90 border-amber-500 text-amber-950 hover:bg-amber-200 decoration-amber-500',
    info: 'bg-sky-100/90 border-sky-500 text-sky-950 hover:bg-sky-200 decoration-sky-500',
  };

  const active: Record<ClauseSeverity, string> = {
    high: 'ring-2 ring-red-500 ring-offset-1 bg-red-200',
    warning: 'ring-2 ring-amber-500 ring-offset-1 bg-amber-200',
    info: 'ring-2 ring-sky-500 ring-offset-1 bg-sky-200',
  };

  return `${base} ${bySeverity[severity]} ${isActive ? active[severity] : ''}`;
}

export function explanationCardClass(
  severity: ClauseSeverity,
  isActive: boolean
): string {
  const base = 'p-4 rounded-lg border-l-4 transition-all duration-200 scroll-mt-24';
  const map: Record<ClauseSeverity, string> = {
    high: 'border-risk-red bg-red-50',
    warning: 'border-amber-500 bg-amber-50',
    info: 'border-sky-500 bg-sky-50',
  };
  const active = isActive ? 'ring-2 ring-offset-1 shadow-md' : '';
  const ring: Record<ClauseSeverity, string> = {
    high: 'ring-risk-red',
    warning: 'ring-amber-500',
    info: 'ring-sky-500',
  };
  return `${base} ${map[severity]} ${isActive ? `${active} ${ring[severity]}` : ''}`;
}
