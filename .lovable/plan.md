

# VAPI Voice Call App

## Overview
A voice call interface powered by VAPI that displays real-time call status, transcripts, and function calls, with a Supabase backend for webhook processing and data persistence.

## Setup: Supabase & Secrets
- Enable Lovable Cloud (Supabase backend)
- Store the **VAPI Private Key** as a Supabase secret (`VAPI_PRIVATE_KEY`) for use in the edge function
- The **Public Key** (`0400cd3c-3ef5-4856-a24b-b2daa83851c5`) and **Assistant ID** (`74a343d2-d7b3-4b01-813e-49728a638df6`) will be used directly in the frontend code (they are publishable)

---

## Page: Voice Call Interface
A clean, centered card layout with:
- **Call Button** — Large mic button to start/stop a voice call using the VAPI Web SDK (`@vapi-ai/web`)
- **Status Indicator** — Shows current call state (idle, connecting, in-progress, ended) with color-coded badge and pulse animation
- **Live Transcript Area** — Scrollable area displaying transcript lines in real-time with speaker labels (user vs assistant)
- **Function Call Display** — Inline within the transcript timeline, showing function calls as labeled cards with function name and parameters
- **Call History** — Below the main card, a list of previous calls with timestamps and expandable transcripts/function calls

## Backend: Supabase

### Database Tables
- **calls** — Stores call records (vapi_call_id, status, started_at, ended_at)
- **transcripts** — Stores transcript entries linked to a call (speaker role, text, timestamp)
- **function_calls** — Stores function call events linked to a call (function name, parameters, timestamp)

### Edge Function: `vapi-webhook`
- Receives POST requests from VAPI's Server URL
- Handles four event types:
  - **call-started** → Creates a call record with status "in-progress"
  - **transcript** → Inserts transcript lines into the transcripts table
  - **function-call** → Inserts function name and parameters into the function_calls table
  - **call-ended** → Updates call record with ended_at and status "ended"

### Real-Time Updates
- Frontend subscribes to Supabase Realtime on all three tables
- UI updates instantly when the webhook writes data — no polling needed

## After Deployment
- You'll copy the edge function URL and set it as your **Server URL** in the VAPI dashboard to receive webhook events

