export type Plan = 'free' | 'pro';
export type PurchaseType = 'one-time' | null;
export type SubscriptionStatus =
  | 'active'
  | 'inactive'
  | 'canceled'
  | 'past_due'
  | null;

export interface Profile {
  id: string;
  email: string | null;
  plan: Plan;
  purchase_type: PurchaseType;
  analyses_used: number;
  analyses_limit: number;
  subscription_status: SubscriptionStatus;
  usage_month: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractAnalysisRow {
  id: string;
  user_id: string;
  contract_preview: string | null;
  analysis_json: Record<string, unknown>;
  risk_score_percentage: number | null;
  created_at: string;
}
