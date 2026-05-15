'use client';

import { useEffect, useState } from 'react';
import type { ContractRiskScore, RiskLevel } from '@/lib/analysisTypes';
import { RiskLevelBadge } from './RiskLevelBadge';

const barColor: Record<RiskLevel, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-risk-red',
};

const numberColor: Record<RiskLevel, string> = {
  low: 'text-emerald-600',
  medium: 'text-amber-600',
  high: 'text-risk-red',
};

function useAnimatedPercentage(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(target);
      return;
    }
    setValue(0);
    const duration = 950;
    let start: number | null = null;
    let frame: number;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

export function RiskScoreDisplay({ score }: { score: ContractRiskScore }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const animatedPct = useAnimatedPercentage(score.percentage, visible);

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-gray-200/90 bg-gradient-to-br from-white via-gray-50/90 to-white shadow-sm transition-all duration-500 ease-out motion-reduce:transition-none ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
      }`}
      aria-labelledby="risk-score-heading"
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3
              id="risk-score-heading"
              className="text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              Contract risk score
            </h3>
            <RiskLevelBadge level={score.level} />
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-5xl font-bold tabular-nums tracking-tight transition-transform duration-500 ease-out sm:text-6xl ${numberColor[score.level]}`}
              >
                {animatedPct}
              </span>
              <span className="pb-1 text-base font-medium text-gray-400 sm:text-lg">/ 100</span>
            </div>
            <p
              className={`max-w-xl text-sm leading-relaxed text-gray-700 transition-opacity duration-500 ease-out delay-100 motion-reduce:delay-0 sm:text-right sm:text-base ${
                visible ? 'opacity-100' : 'opacity-0 motion-reduce:opacity-100'
              }`}
            >
              {score.explanation}
            </p>
          </div>

          <div className="pt-1">
            <div className="mb-1.5 flex justify-between text-xs text-gray-500">
              <span>Overall exposure</span>
              <span className="tabular-nums font-medium text-gray-600">{animatedPct}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-200/90 ring-1 ring-inset ring-gray-900/5">
              <div
                className={`h-full rounded-full shadow-sm transition-[width] duration-[900ms] ease-out motion-reduce:transition-none ${barColor[score.level]}`}
                style={{ width: `${animatedPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
