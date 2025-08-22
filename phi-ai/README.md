# PhiAI · Curie (MVP)

A production-ready MVP of a Perplexity-style chatbot. Built with Next.js (App Router) + Tailwind + Prisma (SQLite). Web search via Tavily, LLM via OpenRouter with DeepSeek→Llama fallback. Streams responses with inline citations. Admin dashboard with token protection.

## Features
- Streaming chat with SSE and live citations panel
- Reasoning trace toggle (when model provides reasoning)
- DeepSeek→Llama fallback through OpenRouter
- Web search + page scraping to build RAG context
- Chat history, like/dislike feedback, delete conversations
- Admin stats (token-protected)
- Mobile-first responsive UI, brand palette

## Quick Start

1. Requirements: Node 18+, pnpm or npm.
2. Clone this repository and create environment file:

```bash
cp .env.example .env
```

3. Set variables in `.env`:
- `OPENROUTER_API_KEY`: free key from OpenRouter
- `TAVILY_API_KEY`: free key from Tavily (or set credits to 0 to disable web search)
- `ADMIN_TOKEN`: any strong secret to view admin stats
- Optional: tweak `OPENROUTER_PREFERRED_MODELS`

4. Install deps and generate Prisma client:

```bash
pnpm install
```

5. Initialize SQLite database:

```bash
npx prisma migrate dev --name init
```

6. Start dev server:

```bash
pnpm dev
```

7. Open `http://localhost:3000`.

## Deploy (free tiers)
- Frontend + API: Vercel (import repo, set env vars)
- Database: SQLite file shipped with Vercel works for light traffic; for multi-region use, switch to Neon/Postgres or Turso and update `DATABASE_URL`.
- Alternative backends: Railway/Render (Node server). Ensure `DATABASE_URL` is persistent.

## Admin Dashboard
- Visit `/admin`, enter `ADMIN_TOKEN` and load stats.

## Brand & Identity
- Colors from request: primary `#2563EB`, accent `#FF6B00`, secondary `#00C9A7`, base `#F7F8FC`, neutral `#1F2937`.
- Logo file: place your provided logo at `public/phi-logo.png`.

## Notes
- Credits: daily search credits default to 200 and reset automatically. When credits are 0, Curie answers without web citations.
- Guardrails: Curie always identifies as "Curie from PhiAI" and refuses jailbreaks.

## Roadmap
- RAGFlow/Farfalle/Deep Research integration hooks can be connected in `src/lib/search.ts` and `/api/ask`.
- Export chat, PDF/Markdown, advanced admin analytics.