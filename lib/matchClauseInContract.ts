/**
 * Locate clause quotes inside the full contract text (exact match, then normalized whitespace).
 */

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function buildWhitespaceFlexiblePattern(quote: string): RegExp | null {
  const trimmed = quote.trim();
  if (trimmed.length < 8) return null;

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return null;

  const escaped = parts.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  try {
    return new RegExp(escaped.join('\\s+'), 'i');
  } catch {
    return null;
  }
}

export function findQuoteRange(
  contractText: string,
  quote: string
): { start: number; end: number } | null {
  const q = quote.trim();
  if (!q || q.length < 4) return null;

  const exact = contractText.indexOf(q);
  if (exact !== -1) {
    return { start: exact, end: exact + q.length };
  }

  const flexible = buildWhitespaceFlexiblePattern(q);
  if (flexible) {
    const match = flexible.exec(contractText);
    if (match && match.index !== undefined) {
      return { start: match.index, end: match.index + match[0].length };
    }
  }

  const normQuote = collapseWhitespace(q);
  if (normQuote.length < 8) return null;

  const normContract = collapseWhitespace(contractText);
  const normIndex = normContract.indexOf(normQuote);
  if (normIndex === -1) return null;

  let normPos = 0;
  let start = -1;
  let end = -1;

  for (let i = 0; i < contractText.length; i++) {
    if (/\s/.test(contractText[i])) {
      if (normPos > 0 && !/\s/.test(contractText[i - 1] ?? '')) {
        normPos++;
      }
      continue;
    }
    if (normPos === normIndex && start === -1) start = i;
    if (normPos === normIndex + normQuote.length - 1) {
      end = i + 1;
      break;
    }
    normPos++;
  }

  if (start !== -1 && end !== -1 && end > start) {
    return { start, end };
  }

  return null;
}
