'use client';

import { useEffect, useState } from 'react';
import type { ContractRiskScore } from '@/lib/analysisTypes';
import { RiskLevelBadge } from './RiskLevelBadge';
import { riskLevelStyles } from '@/components/contract-highlight/highlightStyles';
import { Card } from '@/components/ui/Card';

export function RiskScoreDisplay({ score }: { score: ContractRiskScore }) {
  const styles = riskLevelStyles[score.level];
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = requestAnimationFrame(() => setBarWidth(score.percentage));
    return () => cancelAnimationFrame(t);
  }, [score.percentage]);

  return (
    <Card aria-labelledby="risk-score-heading" className="overflow-hidden">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="risk-score-heading">Risk score</h2>
          <RiskLevelBadge level={score.level} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl sm:text-5xl font-semibold tabular-nums tracking-tight transition-all duration-700 ${styles.score}`}
            >
              {score.percentage}
            </span>
            <span className="pb-1 text-sm font-medium text-ink-faint">/ 100</span>
          </div>
          <p className="prose-body max-w-xl sm:text-right">{score.explanation}</p>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs text-ink-muted">
            <span>Overall exposure</span>
            <span className="tabular-nums font-medium text-ink-secondary">
              {score.percentage}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-subtle">
            <div
              className={`h-full rounded-full transition-[width] duration-1000 ease-out ${styles.bar}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
