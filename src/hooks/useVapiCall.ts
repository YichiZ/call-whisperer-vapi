import { useState, useRef, useCallback, useEffect } from "react";
import Vapi from "@vapi-ai/web";

const VAPI_PUBLIC_KEY = "0400cd3c-3ef5-4856-a24b-b2daa83851c5";
const ASSISTANT_ID = "74a343d2-d7b3-4b01-813e-49728a638df6";

export type CallStatus = "idle" | "connecting" | "in-progress" | "ended";

export interface LocalTranscript {
  role: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

export function useVapiCall() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [localTranscripts, setLocalTranscripts] = useState<LocalTranscript[]>([]);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("in-progress");
    });

    vapi.on("call-end", () => {
      setStatus("ended");
      setActiveCallId(null);
      setTimeout(() => setStatus("idle"), 3000);
    });

    vapi.on("message", (msg: any) => {
      if (msg.type === "transcript") {
        const entry: LocalTranscript = {
          role: msg.role || "unknown",
          text: msg.transcript || "",
          timestamp: new Date(),
          isFinal: msg.transcriptType === "final",
        };
        setLocalTranscripts((prev) => {
          // Replace last partial from same role with final
          if (entry.isFinal) {
            const withoutPartial = prev.filter(
              (t) => !(t.role === entry.role && !t.isFinal)
            );
            return [...withoutPartial, entry];
          }
          // Replace existing partial from same role
          const withoutPartial = prev.filter(
            (t) => !(t.role === entry.role && !t.isFinal)
          );
          return [...withoutPartial, entry];
        });
      }
    });

    vapi.on("error", (err: any) => {
      console.error("VAPI error:", err);
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) return;
    setStatus("connecting");
    setLocalTranscripts([]);
    try {
      const call = await vapiRef.current.start(ASSISTANT_ID);
      if (call?.id) setActiveCallId(call.id);
    } catch (err) {
      console.error("Failed to start call:", err);
      setStatus("idle");
    }
  }, []);

  const endCall = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
  }, []);

  const toggleCall = useCallback(() => {
    if (status === "idle" || status === "ended") {
      startCall();
    } else if (status === "in-progress") {
      endCall();
    }
  }, [status, startCall, endCall]);

  return { status, localTranscripts, activeCallId, toggleCall };
}
