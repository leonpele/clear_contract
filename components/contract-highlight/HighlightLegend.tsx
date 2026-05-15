import { HIGHLIGHT_LEGEND } from './highlightStyles';

export function HighlightLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
      {HIGHLIGHT_LEGEND.map((item) => (
        <span key={item.severity} className="inline-flex items-center gap-1.5">
          <span
            className={`inline-block h-3 w-6 rounded border ${item.swatch}`}
            aria-hidden
          />
          {item.label}
        </span>
      ))}
      <span className="text-gray-400">· Click highlighted text for details</span>
    </div>
  );
}
