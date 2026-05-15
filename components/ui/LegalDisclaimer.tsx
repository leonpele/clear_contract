export function LegalDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p
      className={`text-xs text-ink-faint leading-relaxed ${className}`}
      role="note"
    >
      AI-generated analysis. Not legal advice. Review important terms with a
      qualified professional before signing.
    </p>
  );
}
