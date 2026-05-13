'use client';

import { useState, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import ResultsPanel from '@/components/ResultsPanel';
import PaywallModal from '@/components/PaywallModal';
import { parseUsage, incrementUsage, isPaidUser, setPaidUser } from '@/lib/parseUsage';

interface AnalysisResult {
  summary: string;
  risky_clauses: Array<{ quote: string; explanation: string }>;
  favorable_clauses: Array<{ quote: string; explanation: string }>;
  key_numbers: Array<{ label: string; value: string }>;
}

export default function AnalyzePage() {
  const [contractText, setContractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const count = parseUsage();
    setUsageCount(count);
    setPaid(isPaidUser());
  }, []);

  const handleAnalyze = async () => {
    if (!contractText.trim()) {
      setError('Please paste or upload contract text');
      return;
    }

    if (contractText.length > 50000) {
      setError('Contract text exceeds 50,000 characters');
      return;
    }

    // Check free tier limit
    if (!paid && usageCount >= 3) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: contractText }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      incrementUsage();
      setUsageCount(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaidUser();
    setPaid(true);
    setShowPaywall(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-risk-red">ContractClear</h1>
          </div>
          <div className="text-sm text-gray-600">
            {paid ? (
              <span className="text-safe-green font-semibold">✓ Unlimited access</span>
            ) : (
              <span>{3 - usageCount} analyses remaining</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Upload or paste your contract</h2>
            <p className="text-gray-600">Max 50,000 characters</p>

            {/* Upload Zone */}
            <UploadZone onTextExtracted={setContractText} currentText={contractText} />

            {/* Textarea */}
            <textarea
              value={contractText}
              onChange={(e) => {
                setContractText(e.target.value);
                setError('');
              }}
              placeholder="Paste contract text here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-risk-red focus:border-transparent resize-none"
            />

            <div className="text-sm text-gray-500">
              {contractText.length} / 50,000 characters
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !contractText.trim()}
              className="w-full py-3 bg-risk-red text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                'Analyze Contract'
              )}
            </button>
          </div>

          {/* Results Section */}
          <div>
            {results ? (
              <ResultsPanel results={results} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-5xl mb-4">📄</div>
                <p className="text-gray-600 text-lg">
                  Submit a contract to see analysis results here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal 
          onClose={() => setShowPaywall(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
