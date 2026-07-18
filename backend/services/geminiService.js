import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------------------------------------------------------
// Gemini 2.0 Flash — fast multimodal generation
// ---------------------------------------------------------------------------
export async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) throw new Error('Empty response from Gemini model');
  return text;
}
