# Self-Consistency Multi-Model GenAI (Next.js Version)

This is a UI-based web app built with Next.js 14 (App Router) — frontend and backend combined in one single project for easy, one-click Vercel deployment.

It demonstrates the concept of **Self-Consistency** in Generative AI: instead of relying on a single zero-shot response, this application sends the user's prompt in parallel to three different AI models, then makes a fourth call using an "evaluator" model to cross-reference and merge the strongest parts of the individual answers into a synthesized final output.

## Models Used
- **Parallel Generation (3 calls):**
  - Groq Llama 3.3 70B Versatile (`llama-3.3-70b-versatile`)
  - Groq Llama 3.1 8B Instant (`llama-3.1-8b-instant`)
  - Google Gemini 3.1 Flash Lite (`gemini-3.1-flash-lite`)
- **Evaluator / Synthesizer (1 call):**
  - Groq Llama 3.3 70B Versatile (`llama-3.3-70b-versatile`)

## Orchestration Flow
1. **User Input**: User enters a single prompt in the React frontend and hits Enter to generate.
2. **Parallel Execution**: The Next.js Route Handler at `/api/generate` sends the prompt concurrently to all three models via `Promise.allSettled()`.
3. **Graceful Degradation**: If one model fails or times out (15s limit), the handler catches the error and returns it inside the payload. The app marks that model as unavailable but continues processing other responses.
4. **Evaluation**: The backend takes all successful responses and sends them to the evaluator model. The evaluator compares them for accuracy, completeness, and clarity, and returns the synthesized final answer along with comparison notes.
5. **Display**: The UI renders the three individual cards side-by-side (collapsible) with custom loading skeletons, followed by the gold-accented synthesized answer and comparison notes.

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your keys:
- `GROQ_API_KEY`: Get this from [console.groq.com/keys](https://console.groq.com/keys)
- `GEMINI_API_KEY`: Get this from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment (Vercel)

Deploy as a single project on Vercel:
1. Import your GitHub repository on [vercel.com](https://vercel.com).
2. Add your environment variables (`GROQ_API_KEY` and `GEMINI_API_KEY`) in the Vercel project settings.
3. Click **Deploy**. Vercel will build and host both the frontend pages and backend API routes in a single step.

## External Setup Required (Do This Yourself)

Before deploying, ensure you complete this checklist:

- [ ] Push code to GitHub (ensuring `.env.local` is gitignored)
- [ ] Import repo on [vercel.com](https://vercel.com)
- [ ] Add `GROQ_API_KEY` and `GEMINI_API_KEY` as environment variables in the Vercel dashboard
- [ ] Deploy and test the live link end-to-end
