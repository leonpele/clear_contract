'use client';

import type { AnalysisResult } from '@/lib/analysisTypes';
import { RiskScoreDisplay } from '@/components/contract-risk/RiskScoreDisplay';
import { ContractHighlightSection } from '@/components/contract-highlight/ContractHighlightSection';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';

const FEEDBACK_FORM_URL = 'https://tally.so/r/zx2kR0';

/** Guaranteed gap above section (padding does not collapse like hr margins). */
const RESULT_SECTION_LEAD = 'pt-10 sm:pt-14 border-t border-border';

interface ResultsPanelProps {
  results: AnalysisResult;
  contractText: string;
}

export default function ResultsPanel({ results, contractText }: ResultsPanelProps) {
  const scoreKey = `${results.risk_score.percentage}-${results.risk_score.level}-${results.risk_score.explanation.slice(0, 120)}`;

  const recommendations = [
    ...results.risky_clauses.slice(0, 4).map((c) => c.explanation),
    ...(results.risk_score.level === 'high'
      ? [results.risk_score.explanation]
      : []),
  ].slice(0, 5);

  return (
    <div className="space-y-8">
      <Section title="Risk score" subtitle="Overall assessment based on detected terms.">
        <RiskScoreDisplay key={scoreKey} score={results.risk_score} />
      </Section>

      <Section
        className={RESULT_SECTION_LEAD}
        title="Simplified summary"
        subtitle="Plain-language overview of what this agreement covers."
      >
        <Card muted>
          <p className="prose-body">{results.summary}</p>
        </Card>
      </Section>

      <Section
        className={RESULT_SECTION_LEAD}
        title="Highlighted clauses"
        subtitle="Passages from your contract linked to explanations. Select text to jump to details."
      >
        <ContractHighlightSection contractText={contractText} results={results} />
      </Section>

      {recommendations.length > 0 && (
        <>
          <Section
            className={RESULT_SECTION_LEAD}
            title="Recommendations"
            subtitle="Practical next steps before you sign or negotiate."
          >
            <Card>
              <ul className="space-y-3">
                {recommendations.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-sm leading-relaxed text-ink-secondary"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Section>
        </>
      )}

      {results.key_numbers.length > 0 && (
        <>
          <Section
            className={RESULT_SECTION_LEAD}
            title="Key numbers"
            subtitle="Dates, amounts, and durations extracted."
          >
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-muted">
                      <th className="text-left px-4 py-3 font-medium text-ink-secondary">
                        Label
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-ink-secondary">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.key_numbers.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 text-ink-muted">{item.label}</td>
                        <td className="px-4 py-3 font-medium text-ink">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Section>
        </>
      )}

      <div className={`${RESULT_SECTION_LEAD} space-y-4`}>
        <LegalDisclaimer />
        <p className="text-sm text-ink-muted">
          How was your experience?{' '}
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover underline underline-offset-2 transition-colors duration-200"
          >
            Share feedback
          </a>
        </p>
      </div>
    </div>
  );
}
