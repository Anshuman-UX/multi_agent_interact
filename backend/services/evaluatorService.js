import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------------------------------------------------------------------------
// Evaluator system prompt
// ---------------------------------------------------------------------------
const EVALUATOR_SYSTEM_PROMPT = `You are an expert evaluator. Below are independent AI-generated answers to the same user question, from different models. Compare them for accuracy, completeness, clarity, and reasoning quality. Identify the strongest elements of each. Then synthesize a single best final answer that combines the strongest parts. Do not just copy one response — actively merge and improve.

Your output MUST follow this exact format with these two markdown headers:

## Final Answer
[Your synthesized best answer here — this can be multiple paragraphs]

## Comparison Notes
[2-3 lines explaining what you took from each model and why]`;

// ---------------------------------------------------------------------------
// evaluateResponses
// ---------------------------------------------------------------------------
export async function evaluateResponses(originalPrompt, responses) {
  // Build the user message with all successful responses
  let userContent = `**Original user question:**\n"${originalPrompt}"\n\n`;
  userContent += `**Responses from different AI models:**\n\n`;

  for (const [modelLabel, text] of Object.entries(responses)) {
    userContent += `--- Response from ${modelLabel} ---\n${text}\n\n`;
  }

  userContent +=
    'Now compare these responses and synthesize the best final answer following the required format with ## Final Answer and ## Comparison Notes headers.';

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: EVALUATOR_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    temperature: 0.3, // lower temp for more focused evaluation
    max_tokens: 2048,
  });

  const content = response.choices?.[0]?.message?.content || '';

  // ── Parse the structured response ─────────────────────────────────────
  const finalAnswerMatch = content.match(
    /## Final Answer\s*\n([\s\S]*?)(?=\n## Comparison Notes|$)/
  );
  const comparisonNotesMatch = content.match(
    /## Comparison Notes\s*\n([\s\S]*?)$/
  );

  return {
    finalAnswer: finalAnswerMatch
      ? finalAnswerMatch[1].trim()
      : content.trim() || 'Could not parse final answer from evaluator.',
    comparisonNotes: comparisonNotesMatch
      ? comparisonNotesMatch[1].trim()
      : 'Comparison notes not available in the expected format.',
  };
}
