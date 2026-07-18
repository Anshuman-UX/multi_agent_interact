import { useState } from 'react';

export default function ComparisonNotes({ text }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  return (
    <div
      className="mt-6 mb-16 max-w-5xl mx-auto animate-slide-up"
      style={{ animationDelay: '650ms' }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm group"
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
        <span className="group-hover:underline underline-offset-4">
          Comparison Notes — How was this synthesized?
        </span>
      </button>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded ? '400px' : '0',
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? '12px' : '0',
        }}
      >
        <div className="glass-card p-5 text-[13px] text-gray-400 leading-relaxed whitespace-pre-wrap">
          {text}
        </div>
      </div>
    </div>
  );
}
