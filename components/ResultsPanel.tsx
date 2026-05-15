'use client';

import type { AnalysisResult } from '@/lib/analysisTypes';
import { RiskScoreDisplay } from '@/components/contract-risk/RiskScoreDisplay';
import { ContractHighlightSection } from '@/components/contract-highlight/ContractHighlightSection';

const FEEDBACK_FORM_URL = 'https://tally.so/r/zx2kR0';

interface ResultsPanelProps {
  results: AnalysisResult;
  contractText: string;
}

export default function ResultsPanel({ results, contractText }: ResultsPanelProps) {
  const scoreKey = `${results.risk_score.percentage}-${results.risk_score.level}-${results.risk_score.explanation.slice(0, 120)}`;

  return (
    <div className="space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden">
      <RiskScoreDisplay key={scoreKey} score={results.risk_score} />

      <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{results.summary}</p>
      </div>

      <ContractHighlightSection contractText={contractText} results={results} />

      {results.key_numbers.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Key numbers</h3>
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[280px] text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-2 text-gray-700 font-semibold">Label</th>
                  <th className="text-left p-2 text-gray-700 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {results.key_numbers.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-2 text-gray-600">{item.label}</td>
                    <td className="p-2 text-gray-900 font-medium">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">
          How was your experience? We read every response.
        </p>
        <a
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-800 font-medium text-sm hover:border-risk-red hover:text-risk-red hover:bg-red-50 transition"
        >
          <span aria-hidden>💬</span>
          Give us your feedback
        </a>
      </div>
    </div>
  );
}
