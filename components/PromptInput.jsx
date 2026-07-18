export default function PromptInput({ prompt, setPrompt, onSubmit, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative group">
        {/* Gradient glow behind the card */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
          style={{
            background:
              'linear-gradient(135deg, #8b5cf6, #3b82f6, #10b981)',
          }}
        />
        <div
          className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-500 blur-sm ${
            loading ? 'opacity-60' : 'opacity-20'
          }`}
          style={{
            background:
              'linear-gradient(135deg, #8b5cf6, #3b82f6, #10b981)',
            backgroundSize: '200% 200%',
            animation: loading ? 'gradientShift 2s ease-in-out infinite' : 'none',
          }}
        />

        {/* Card body */}
        <div className="relative glass-card p-6">
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… e.g. 'Explain quantum entanglement in simple terms'"
            rows={4}
            disabled={loading}
            className="w-full bg-transparent text-white placeholder-gray-600 resize-none outline-none text-base sm:text-lg leading-relaxed disabled:opacity-50"
          />

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[.04]">
            <span className="text-[11px] text-gray-600 select-none">
              Enter to submit · Shift + Enter for new line
            </span>

            <button
              id="submit-btn"
              onClick={onSubmit}
              disabled={loading || !prompt.trim()}
              className="relative px-7 py-2.5 rounded-xl font-semibold text-sm text-white
                         bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500
                         hover:shadow-lg hover:shadow-purple-500/20
                         active:scale-[0.97]
                         transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
                         flex items-center gap-2.5"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
