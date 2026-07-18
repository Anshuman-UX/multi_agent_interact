# Self-Consistency Multi-Model GenAI

This is a UI-based web app that demonstrates the concept of **Self-Consistency** in Generative AI. 

Instead of trusting a single zero-shot response from one model, this application takes a user's prompt and sends it in parallel to multiple different AI models. It then uses a final "evaluator" model to synthesize a single, best-quality answer by cross-referencing and merging the strongest parts of the individual responses.

## Models Used
- **Parallel Generation (3 calls):**
  - Groq Llama 3.3 70B Versatile (`llama-3.3-70b-versatile`)
  - Groq Gemma2 9B IT (`gemma2-9b-it`)
  - Google Gemini 1.5 Flash (`gemini-1.5-flash`)
- **Evaluator / Synthesizer (1 call):**
  - Groq Llama 3.3 70B Versatile (`llama-3.3-70b-versatile`)

## Orchestration Flow
1. **User Input**: User enters a single prompt in the React frontend and clicks Generate.
2. **Parallel Execution**: The Express backend sends the prompt concurrently to the 3 generative models via `Promise.allSettled()`.
3. **Graceful Degradation**: If one API call fails or times out (15s limit), the app catches the error and marks that model as unavailable, but continues without crashing.
4. **Evaluation**: The backend takes all successful responses and sends them to the evaluator model (Llama 3.3 70B) along with the original prompt. The evaluator is instructed to compare the answers for accuracy, completeness, and clarity, and synthesize a final best answer.
5. **Display**: The React UI displays the 3 individual raw responses (with loading states) side-by-side, followed by the highlighted Final Synthesized Answer and Comparison Notes explaining the synthesizer's reasoning.

## Local Setup

### 1. Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd multi-model-genai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
In the `backend` folder, copy the example `.env` file:
```bash
cd backend
cp .env.example .env
```
Open the `.env` file and fill in your real API keys:
- `GROQ_API_KEY`: Get this from [console.groq.com/keys](https://console.groq.com/keys)
- `GEMINI_API_KEY`: Get this from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

*(Note: API keys are strictly kept on the backend, and the `.env` file is gitignored so they are never exposed to the frontend or source control.)*

### 3. Run Locally
You need two terminal tabs to run the backend and frontend simultaneously.

**Tab 1 (Backend):**
```bash
cd backend
npm run dev
# Starts Express server on http://localhost:3001
```

**Tab 2 (Frontend):**
```bash
cd frontend
npm run dev
# Starts Vite React dev server on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

---

## Deployment (Vercel)

This project is structured as a standard Node/React monorepo, meaning it is ready to be deployed on platforms like Vercel or Render.
*Live deployment URL will be added here once deployed.*

## External Setup Required (Do This Yourself)

Before deploying or running, ensure you complete this checklist:

- [ ] I already have a Groq API key (`console.groq.com/keys`) — `GROQ_API_KEY`
- [ ] I already have a Gemini API key (`aistudio.google.com/app/apikey`) — `GEMINI_API_KEY`
- [ ] Create a GitHub repository and push this code to the `main` branch.
- [ ] Go to [Vercel](https://vercel.com), click "Add New Project", and import your GitHub repo.
- [ ] In the Vercel deployment settings, ensure you specify the `frontend` folder as the Root Directory, or configure a custom setup for the backend/frontend split. (Alternatively, you can host the Express backend on Render/Heroku and the Frontend on Vercel).
- [ ] Add the `GROQ_API_KEY` and `GEMINI_API_KEY` as Environment Variables in your Vercel (or Render) dashboard.
- [ ] Deploy and test the live link.
