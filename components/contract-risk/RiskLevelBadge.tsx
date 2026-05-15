import type { RiskLevel } from '@/lib/analysisTypes';
import { riskLevelStyles } from '@/components/contract-highlight/highlightStyles';

const label: Record<RiskLevel, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${riskLevelStyles[level].badge}`}
    >
      {label[level]}
    </span>
  );
}
