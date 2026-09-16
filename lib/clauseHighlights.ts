import type { AnalysisResult, ClauseHighlight, ClauseSeverity } from './analysisTypes';
import { findQuoteRange } from './matchClauseInContract';

const SEVERITY_RANK: Record<ClauseSeverity, number> = {
  high: 3,
  warning: 2,
  info: 1,
};

function normalizeRiskSeverity(
  raw: unknown,
  index: number
): ClauseSeverity {
  if (raw === 'high' || raw === 'warning') return raw;
  return index === 0 ? 'high' : 'warning';
}

export function buildClauseHighlights(
  contractText: string,
  results: AnalysisResult
): ClauseHighlight[] {
  const highlights: ClauseHighlight[] = [];

  results.risky_clauses.forEach((clause, index) => {
    const range = findQuoteRange(contractText, clause.quote);
    if (!range) return;
    highlights.push({
      id: `risk-${index}`,
      start: range.start,
      end: range.end,
      severity: normalizeRiskSeverity(clause.severity, index),
      category: 'risk',
      quote: clause.quote,
      explanation: clause.explanation,
      title: 'Risky clause',
    });
  });

  results.favorable_clauses.forEach((clause, index) => {
    const range = findQuoteRange(contractText, clause.quote);
    if (!range) return;
    highlights.push({
      id: `fav-${index}`,
      start: range.start,
      end: range.end,
      severity: 'info',
      category: 'favorable',
      quote: clause.quote,
      explanation: clause.explanation,
      title: 'Favorable clause',
    });
  });

  results.key_numbers.forEach((item, index) => {
    const needle = item.value.trim();
    if (needle.length < 2) return;
    const range = findQuoteRange(contractText, needle);
    if (!range) return;
    highlights.push({
      id: `key-${index}`,
      start: range.start,
      end: range.end,
      severity: 'info',
      category: 'key',
      quote: needle,
      explanation: `${item.label}: ${item.value}`,
      title: 'Key detail',
    });
  });

  return resolveOverlappingHighlights(highlights);
}

function resolveOverlappingHighlights(
  highlights: ClauseHighlight[]
): ClauseHighlight[] {
  const sorted = [...highlights].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
  });

  const kept: ClauseHighlight[] = [];

  for (const h of sorted) {
    const overlaps = kept.some(
      (k) => h.start < k.end && h.end > k.start
    );
    if (!overlaps) {
      kept.push(h);
      continue;
    }

    const conflict = kept.find((k) => h.start < k.end && h.end > k.start);
    if (
      conflict &&
      SEVERITY_RANK[h.severity] > SEVERITY_RANK[conflict.severity]
    ) {
      const idx = kept.indexOf(conflict);
      kept[idx] = h;
    }
  }

  return kept.sort((a, b) => a.start - b.start);
}

export type TextSegment =
  | { type: 'plain'; text: string }
  | {
      type: 'highlight';
      text: string;
      highlight: ClauseHighlight;
    };

export function buildTextSegments(
  contractText: string,
  highlights: ClauseHighlight[]
): TextSegment[] {
  if (highlights.length === 0) {
    return [{ type: 'plain', text: contractText }];
  }

  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const h of highlights) {
    if (h.start > cursor) {
      segments.push({
        type: 'plain',
        text: contractText.slice(cursor, h.start),
      });
    }
    if (h.end > h.start) {
      segments.push({
        type: 'highlight',
        text: contractText.slice(h.start, h.end),
        highlight: h,
      });
    }
    cursor = Math.max(cursor, h.end);
  }

  if (cursor < contractText.length) {
    segments.push({ type: 'plain', text: contractText.slice(cursor) });
  }

  return segments;
}
