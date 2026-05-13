'use client';

const FEEDBACK_FORM_URL = 'https://tally.so/r/zx2kR0';

interface AnalysisResult {
  summary: string;
  risky_clauses: Array<{ quote: string; explanation: string }>;
  favorable_clauses: Array<{ quote: string; explanation: string }>;
  key_numbers: Array<{ label: string; value: string }>;
}

interface ResultsPanelProps {
  results: AnalysisResult;
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Summary */}
      <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{results.summary}</p>
      </div>

      {/* Risky Clauses */}
      {results.risky_clauses.length > 0 && (
        <div>
          <h3 className="font-semibold text-risk-red mb-3 flex items-center gap-2">
            ⚠️ Risky Clauses ({results.risky_clauses.length})
          </h3>
          <div className="space-y-3">
            {results.risky_clauses.map((clause, idx) => (
              <div
                key={idx}
                className="border-l-4 border-risk-red bg-red-50 p-4 rounded-lg"
              >
                <p className="text-sm text-gray-600 italic mb-2 border-l-2 border-red-200 pl-2">
                  "{clause.quote}"
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Why it's risky:</strong> {clause.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorable Clauses */}
      {results.favorable_clauses.length > 0 && (
        <div>
          <h3 className="font-semibold text-safe-green mb-3 flex items-center gap-2">
            ✓ Favorable Clauses ({results.favorable_clauses.length})
          </h3>
          <div className="space-y-3">
            {results.favorable_clauses.map((clause, idx) => (
              <div
                key={idx}
                className="border-l-4 border-safe-green bg-green-50 p-4 rounded-lg"
              >
                <p className="text-sm text-gray-600 italic mb-2 border-l-2 border-green-200 pl-2">
                  "{clause.quote}"
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Why it's good:</strong> {clause.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Numbers */}
      {results.key_numbers.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">🔢 Key Numbers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
