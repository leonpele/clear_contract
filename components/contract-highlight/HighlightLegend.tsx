import { HIGHLIGHT_LEGEND } from './highlightStyles';

export function HighlightLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted">
      {HIGHLIGHT_LEGEND.map((item) => (
        <span key={item.severity} className="inline-flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-5 rounded border ${item.swatch}`}
            aria-hidden
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
