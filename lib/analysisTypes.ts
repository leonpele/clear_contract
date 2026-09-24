export type RiskLevel = 'low' | 'medium' | 'high';

/** Highlight color tier in the contract viewer */
export type ClauseSeverity = 'high' | 'warning' | 'info';

export interface ContractRiskScore {
  percentage: number;
  level: RiskLevel;
  explanation: string;
}

export interface RiskyClause {
  quote: string;
  explanation: string;
  severity?: ClauseSeverity;
}

export interface FavorableClause {
  quote: string;
  explanation: string;
}

export interface KeyNumberItem {
  label: string;
  value: string;
}

export interface AnalysisResult {
  summary: string;
  risky_clauses: RiskyClause[];
  favorable_clauses: FavorableClause[];
  key_numbers: KeyNumberItem[];
  risk_score: ContractRiskScore;
}

/** What a visitor without an account gets back: enough to tempt, not the result. */
export interface GuestAnalysisPreview {
  locked: true;
  risk_level: RiskLevel;
  risky_clause_count: number;
}

export type ClauseCategory = 'risk' | 'favorable' | 'key';

export interface ClauseHighlight {
  id: string;
  start: number;
  end: number;
  severity: ClauseSeverity;
  category: ClauseCategory;
  quote: string;
  explanation: string;
  title: string;
}
