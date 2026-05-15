import type { AnalysisResult, ContractRiskScore, RiskLevel } from './analysisTypes';

function levelFromPercentage(p: number): RiskLevel {
  if (p <= 33) return 'low';
  if (p <= 66) return 'medium';
  return 'high';
}

function isRiskLevel(v: unknown): v is RiskLevel {
  return v === 'low' || v === 'medium' || v === 'high';
}

function defaultExplanation(level: RiskLevel, riskyCount: number): string {
  if (level === 'low') {
    return 'Few or no serious red flags were found relative to common contract risks. Always verify specifics with a professional for your situation.';
  }
  if (level === 'medium') {
    return `Several areas warrant attention (${riskyCount} flagged clause(s)). Review renewal, termination, liability, and payment terms before signing.`;
  }
  return 'Multiple high-impact risk patterns were detected. Negotiate or get legal advice before committing, especially around liability, IP, and exit terms.';
}

export function normalizeAnalysisResponse(raw: Record<string, unknown>): AnalysisResult {
  const risky_clauses = Array.isArray(raw.risky_clauses)
    ? (raw.risky_clauses as AnalysisResult['risky_clauses'])
    : [];
  const favorable_clauses = Array.isArray(raw.favorable_clauses)
    ? (raw.favorable_clauses as AnalysisResult['favorable_clauses'])
    : [];
  const key_numbers = Array.isArray(raw.key_numbers)
    ? (raw.key_numbers as AnalysisResult['key_numbers'])
    : [];
  const summary =
    typeof raw.summary === 'string' ? raw.summary : 'Summary unavailable.';

  const rs = raw.risk_score as Record<string, unknown> | undefined;
  let percentage =
    typeof rs?.percentage === 'number'
      ? Math.round(Math.max(0, Math.min(100, rs.percentage)))
      : NaN;

  if (!Number.isFinite(percentage)) {
    percentage = Math.min(88, 12 + risky_clauses.length * 14);
  }

  let level: RiskLevel = isRiskLevel(rs?.level) ? rs.level : levelFromPercentage(percentage);
  const aligned = levelFromPercentage(percentage);
  if (level !== aligned) {
    level = aligned;
  }

  const explanation =
    typeof rs?.explanation === 'string' && rs.explanation.trim().length > 0
      ? rs.explanation.trim()
      : defaultExplanation(level, risky_clauses.length);

  const risk_score: ContractRiskScore = {
    percentage,
    level,
    explanation,
  };

  return {
    summary,
    risky_clauses,
    favorable_clauses,
    key_numbers,
    risk_score,
  };
}
