export default function FinalAnswer({ text }) {
  if (!text) return null;

  return (
    <div className="mt-12 animate-slide-up" style={{ animationDelay: '500ms' }}>
      <div className="relative group max-w-5xl mx-auto">
        {/* Golden glow */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-orange-500/30 blur-sm opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        <div className="relative glass-card overflow-hidden animate-glow">
          {/* Gold accent bar */}
          <div
            className="h-[3px]"
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #d97706)',
            }}
          />

          <div className="p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold gradient-text-gold flex items-center gap-2.5 mb-5">
              <span className="text-2xl">🏆</span>
              Final Synthesized Answer
            </h3>

            <div className="text-[14px] sm:text-[15px] text-gray-200 leading-relaxed whitespace-pre-wrap">
              {text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
