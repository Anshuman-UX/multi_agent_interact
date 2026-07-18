import { useState } from 'react';

export default function ResponseCard({ config, text, error, loading, delay = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasError = !loading && !!error;
  const borderColor = hasError ? '#ef4444' : config.color;

  /* ── Skeleton / loading state ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="h-[3px]" style={{ backgroundColor: config.color }} />
        <div className="p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="text-xl">{config.icon}</span>
            <div>
              <div className="h-3.5 w-28 rounded-full animate-shimmer" />
              <div className="h-2.5 w-16 rounded-full animate-shimmer mt-1.5" />
            </div>
          </div>
          <div className="space-y-3">
            {[100, 83, 66, 50, 33].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full animate-shimmer"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Rendered card ─────────────────────────────────────────────────── */
  return (
    <div
      className="glass-card overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Accent bar */}
      <div className="h-[3px]" style={{ backgroundColor: borderColor }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{config.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">
                {config.label}
              </h3>
              <span className="text-[11px] text-gray-500">{config.provider}</span>
            </div>
          </div>

          {/* Expand / collapse toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[.04] transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: expanded ? '600px' : '0',
            opacity: expanded ? 1 : 0,
          }}
        >
          {hasError ? (
            <div className="p-3 rounded-lg bg-red-500/[.08] border border-red-500/15 text-red-300 text-sm">
              <span className="font-medium">Unavailable — </span>
              {error}
            </div>
          ) : (
            <div className="text-[13px] text-gray-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {text || 'No response received.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
