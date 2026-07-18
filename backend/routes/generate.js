import { Router } from 'express';
import { callLlama, callLlama8B } from '../services/groqService.js';
import { callGemini } from '../services/geminiService.js';
import { evaluateResponses } from '../services/evaluatorService.js';

const router = Router();

// ---------------------------------------------------------------------------
// Utility: wrap a promise with a timeout
// ---------------------------------------------------------------------------
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Request timed out after ${ms / 1000}s`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// ---------------------------------------------------------------------------
// POST /api/generate
// ---------------------------------------------------------------------------
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    // ── Validation ──────────────────────────────────────────────────────
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res
        .status(400)
        .json({ error: 'Prompt is required and must be a non-empty string.' });
    }

    const trimmedPrompt = prompt.trim();
    const MODEL_TIMEOUT = 15_000; // 15 seconds per model call

    console.log(`\n📨 Incoming prompt: "${trimmedPrompt.slice(0, 80)}…"`);

    // ── Step 1: Fire all 3 model calls in parallel ──────────────────────
    const [llamaResult, llama8bResult, geminiResult] = await Promise.allSettled([
      withTimeout(callLlama(trimmedPrompt), MODEL_TIMEOUT),
      withTimeout(callLlama8B(trimmedPrompt), MODEL_TIMEOUT),
      withTimeout(callGemini(trimmedPrompt), MODEL_TIMEOUT),
    ]);

    // ── Step 2: Process results (capture errors gracefully) ─────────────
    const responses = {
      groqLlama: {
        text: llamaResult.status === 'fulfilled' ? llamaResult.value : null,
        error:
          llamaResult.status === 'rejected'
            ? llamaResult.reason?.message || 'Unknown error'
            : null,
        label: 'Llama 3.3 70B (Groq)',
      },
      groqLlama8b: {
        text: llama8bResult.status === 'fulfilled' ? llama8bResult.value : null,
        error:
          llama8bResult.status === 'rejected'
            ? llama8bResult.reason?.message || 'Unknown error'
            : null,
        label: 'Llama 3.1 8B (Groq)',
      },
      gemini: {
        text: geminiResult.status === 'fulfilled' ? geminiResult.value : null,
        error:
          geminiResult.status === 'rejected'
            ? geminiResult.reason?.message || 'Unknown error'
            : null,
        label: 'Gemini 2.0 Flash',
      },
    };

    const succeededCount = Object.values(responses).filter((r) => r.text).length;
    console.log(`   ✅ ${succeededCount}/3 models responded successfully`);

    // ── Step 3: Evaluator call ──────────────────────────────────────────
    const successfulResponses = {};
    for (const [key, val] of Object.entries(responses)) {
      if (val.text) successfulResponses[val.label] = val.text;
    }

    let finalAnswer = '';
    let comparisonNotes = '';

    if (Object.keys(successfulResponses).length > 0) {
      try {
        const evaluation = await withTimeout(
          evaluateResponses(trimmedPrompt, successfulResponses),
          30_000 // evaluator gets 30 s (it processes more text)
        );
        finalAnswer = evaluation.finalAnswer;
        comparisonNotes = evaluation.comparisonNotes;
        console.log('   🏆 Evaluator synthesized final answer');
      } catch (evalError) {
        console.error('   ❌ Evaluator failed:', evalError.message);
        finalAnswer = `Evaluator failed: ${evalError.message}`;
        comparisonNotes =
          'Could not generate comparison notes due to evaluator error.';
      }
    } else {
      finalAnswer = 'No successful model responses to evaluate.';
      comparisonNotes = 'All model calls failed — nothing to compare.';
    }

    // ── Step 4: Return structured JSON ──────────────────────────────────
    res.json({
      prompt: trimmedPrompt,
      responses,
      finalAnswer,
      comparisonNotes,
    });
  } catch (error) {
    console.error('Generate endpoint error:', error);
    res
      .status(500)
      .json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

export default router;
