# 🐾 Pawsome Pals Veterinary

A voice-powered AI veterinary receptionist built with VAPI, React, and Lovable Cloud.

## What it does

- **AI Voice Calls** — Talk to an AI vet receptionist that can look up customer info, check pet medical history, and book appointments.
- **Live Transcript** — See the conversation in real-time with chat bubbles and function call cards.
- **Audio Waveform** — Visual volume indicator reacts to voice input during calls.
- **Call History** — Browse past calls with expandable transcripts and logs.
- **Dashboard UI** — Clean shadcn-style layout with stat cards and tabbed navigation.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Voice AI**: [VAPI](https://vapi.ai) Web SDK (`@vapi-ai/web`)
- **Backend**: Lovable Cloud (Supabase) — Edge Functions, Realtime, PostgreSQL
- **AI Model**: Google Gemini 2.5 Flash Lite (via VAPI)

## Architecture

```
Browser (React + VAPI SDK)
  ├── Starts voice call via VAPI Web SDK
  ├── Receives local transcripts in real-time
  └── Subscribes to Supabase Realtime for persisted data

VAPI Server
  ├── Manages voice call lifecycle
  ├── Runs AI assistant (Gemini)
  └── Sends webhooks to Edge Function

Edge Function (vapi-webhook)
  ├── Receives call events (status, transcript, tool-calls)
  └── Persists data to Supabase tables (calls, transcripts, function_calls)
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `calls` | Call metadata (status, timestamps, vapi_call_id) |
| `transcripts` | Conversation messages (role, text, timestamps) |
| `function_calls` | AI tool invocations (function name, parameters) |

## Getting Started

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

## Environment

Copy `.env.example` to `.env` and fill in the values. Supabase variables are auto-configured by Lovable Cloud. The `VAPI_PRIVATE_KEY` is stored as a Cloud secret (not in `.env`).

## License

MIT
