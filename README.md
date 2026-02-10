# 🐾 Pawsome Pals Veterinary

### 🏆 1st Place Hackathon Winner

> AI-powered voice receptionist for veterinary clinics — handles calls, looks up patients, books appointments, and files insurance claims through natural conversation.

---

## What it does

- **AI Voice Receptionist** — Talk to an AI vet receptionist that greets callers by name, checks pet medical history, books appointments, orders medications, and files insurance claims.
- **Live Transcript** — See the conversation in real-time with chat bubbles and inline function call cards.
- **Audio Waveform** — Circular volume visualizer reacts to voice input during calls.
- **Call History** — Browse past calls with expandable transcripts and tool invocation logs.
- **Dashboard** — Clean shadcn-style layout with stat cards, tabbed navigation, and live status indicator.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Voice AI** | [VAPI](https://vapi.ai) Web SDK (`@vapi-ai/web`) |
| **Backend** | Lovable Cloud (Supabase) — Edge Functions, Realtime, PostgreSQL |
| **AI Model** | Google Gemini 2.5 Flash Lite (via VAPI) |
| **Voice** | MiniMax `English_SereneWoman` (Speech-02-Turbo) |
| **Transcription** | Deepgram Nova-2 |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (React + VAPI Web SDK)                     │
│  ├── Starts/stops voice calls                       │
│  ├── Renders local transcripts in real-time         │
│  └── Subscribes to Supabase Realtime for persisted  │
│      transcripts, function calls & call status      │
└──────────────┬──────────────────────────────────────┘
               │ WebRTC
┌──────────────▼──────────────────────────────────────┐
│  VAPI Server                                        │
│  ├── Manages voice call lifecycle                   │
│  ├── Runs AI assistant (Gemini 2.5 Flash Lite)      │
│  ├── Invokes tools: get_customer_info,              │
│  │   get_pet_medical_history, book_appointment,     │
│  │   order_medication, file_insurance_claim          │
│  └── Sends webhooks ──►  Edge Function              │
└──────────────┬──────────────────────────────────────┘
               │ POST
┌──────────────▼──────────────────────────────────────┐
│  Edge Function (vapi-webhook)                       │
│  ├── status-update  → upsert call record            │
│  ├── transcript     → insert transcript line        │
│  ├── tool-calls     → insert function call log      │
│  └── end-of-call    → mark call ended               │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│  PostgreSQL (Supabase)                              │
│  ├── calls            (status, timestamps)          │
│  ├── transcripts      (role, text)                  │
│  └── function_calls   (name, parameters)            │
└─────────────────────────────────────────────────────┘
```

## AI Assistant Tools

| Tool | Description |
|------|-------------|
| `get_customer_info` | Looks up customer & pet details by phone number |
| `get_pet_medical_history` | Retrieves diagnoses, medications & visit records |
| `book_appointment` | Schedules a vet appointment (Dr. Martinez, Dr. Chen, Dr. Patel) |
| `order_medication` | Orders medication for a pet |
| `file_insurance_claim` | Files an insurance claim for a procedure |

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
