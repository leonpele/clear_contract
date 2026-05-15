export type RiskLevel = 'low' | 'medium' | 'high';

export interface ContractRiskScore {
  percentage: number;
  level: RiskLevel;
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  risky_clauses: Array<{ quote: string; explanation: string }>;
  favorable_clauses: Array<{ quote: string; explanation: string }>;
  key_numbers: Array<{ label: string; value: string }>;
  risk_score: ContractRiskScore;
}
