import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ---------------------------------------------------------------------------
// Llama 3.3 70B Versatile — large-scale reasoning & knowledge
// ---------------------------------------------------------------------------
export async function callLlama(prompt) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful, accurate, and thorough AI assistant. Provide clear and well-reasoned answers.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const text = response.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Llama model');
  return text;
}

// ---------------------------------------------------------------------------
// Llama 3.1 8B Instant — fast, efficient instruction-tuned responses
// ---------------------------------------------------------------------------
export async function callLlama8B(prompt) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful, accurate, and thorough AI assistant. Provide clear and well-reasoned answers.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const text = response.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Llama 3.1 8B model');
  return text;
}
