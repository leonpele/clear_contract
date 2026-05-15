import type { RiskLevel } from '@/lib/analysisTypes';

const label: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

const styles: Record<RiskLevel, string> = {
  low: 'border-emerald-300/80 bg-emerald-50 text-emerald-900 shadow-emerald-100/50',
  medium: 'border-amber-300/90 bg-amber-50 text-amber-950 shadow-amber-100/60',
  high: 'border-red-300/90 bg-red-50 text-red-900 shadow-red-100/50',
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] shadow-sm sm:text-xs ${styles[level]}`}
    >
      {label[level]}
    </span>
  );
}
