import type { CSSProperties } from 'react';

export function LegalDisclaimer({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p
      className={`text-xs text-ink-faint leading-relaxed ${className}`}
      style={style}
      role="note"
    >
      AI-generated analysis. Not legal advice. Review important terms with a
      qualified professional before signing.{' '}
      <a
        href="/cgu#avertissement"
        className="underline hover:text-ink-muted"
      >
        En savoir plus
      </a>
      .
    </p>
  );
}
