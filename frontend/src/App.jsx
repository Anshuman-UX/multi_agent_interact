import { useState } from 'react';
import PromptInput from './components/PromptInput';
import ResponseCard from './components/ResponseCard';
import FinalAnswer from './components/FinalAnswer';
import ComparisonNotes from './components/ComparisonNotes';

/* ── Model display config ──────────────────────────────────────────────── */
const MODELS = [
  {
    key: 'groqLlama',
    label: 'Llama 3.3 70B',
    provider: 'Groq',
    color: '#8b5cf6',
    icon: '🦙',
  },
  {
    key: 'groqGemma',
    label: 'Gemma2 9B',
    provider: 'Groq',
    color: '#10b981',
    icon: '💎',
  },
  {
    key: 'gemini',
    label: 'Gemini 1.5 Flash',
    provider: 'Google',
    color: '#3b82f6',
    icon: '✨',
  },
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* ── Ambient glow blobs ───────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-purple-600/[.07] rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-blue-600/[.07] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/[.04] rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[.06] bg-white/[.02] text-xs text-gray-400 mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Self-Consistency via Multi-Model Synthesis
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold gradient-text mb-4 leading-tight">
            Multi-Model GenAI
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            One prompt → three AI models → one synthesized best answer.
            <br className="hidden sm:block" />
            Cross-reference responses for higher accuracy and reliability.
          </p>
        </header>

        {/* ── Prompt input ─────────────────────────────────────────────────── */}
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {error && (
          <div className="mt-8 max-w-3xl mx-auto animate-slide-up">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[.08] border border-red-500/20 text-red-300">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ── Loading skeleton ─────────────────────────────────────────────── */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {MODELS.map((m) => (
              <ResponseCard key={m.key} config={m} loading />
            ))}
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────────── */}
        {result && !loading && (
          <>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {MODELS.map((m, idx) => (
                <ResponseCard
                  key={m.key}
                  config={m}
                  text={result.responses[m.key]?.text}
                  error={result.responses[m.key]?.error}
                  delay={idx * 150}
                />
              ))}
            </div>

            <FinalAnswer text={result.finalAnswer} />
            <ComparisonNotes text={result.comparisonNotes} />
          </>
        )}

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="mt-16 pb-8 text-center">
          <p className="text-xs text-gray-600">
            Powered by Groq (Llama&nbsp;3.3&nbsp;70B&nbsp;+ Gemma2&nbsp;9B) &amp; Google Gemini&nbsp;1.5&nbsp;Flash
          </p>
        </footer>
      </div>
    </div>
  );
}
