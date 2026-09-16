/** The 5 product events tracked end-to-end: signup through paid retention. */
export type AnalyticsEvent =
  | 'signup'
  | 'first_document_uploaded'
  | 'analysis_completed'
  | 'checkout'
  | 'subscription_active';
