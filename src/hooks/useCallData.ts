import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Call = Tables<"calls">;
type Transcript = Tables<"transcripts">;
type FunctionCall = Tables<"function_calls">;

export interface CallWithDetails extends Call {
  transcripts: Transcript[];
  function_calls: FunctionCall[];
}

export function useCallData() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [functionCalls, setFunctionCalls] = useState<FunctionCall[]>([]);

  // Initial fetch
  useEffect(() => {
    const fetchAll = async () => {
      const [callsRes, transRes, fnRes] = await Promise.all([
        supabase.from("calls").select("*").order("started_at", { ascending: false }),
        supabase.from("transcripts").select("*").order("created_at", { ascending: true }),
        supabase.from("function_calls").select("*").order("created_at", { ascending: true }),
      ]);
      if (callsRes.data) setCalls(callsRes.data);
      if (transRes.data) setTranscripts(transRes.data);
      if (fnRes.data) setFunctionCalls(fnRes.data);
    };
    fetchAll();
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("call-data-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "calls" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setCalls((prev) => [payload.new as Call, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setCalls((prev) =>
            prev.map((c) => (c.id === (payload.new as Call).id ? (payload.new as Call) : c))
          );
        }
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "transcripts" }, (payload) => {
        setTranscripts((prev) => [...prev, payload.new as Transcript]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "function_calls" }, (payload) => {
        setFunctionCalls((prev) => [...prev, payload.new as FunctionCall]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCallDetails = (callId: string): CallWithDetails | undefined => {
    const call = calls.find((c) => c.id === callId);
    if (!call) return undefined;
    return {
      ...call,
      transcripts: transcripts.filter((t) => t.call_id === callId),
      function_calls: functionCalls.filter((f) => f.call_id === callId),
    };
  };

  const activeCall = calls.find((c) => c.status === "in-progress");

  return { calls, transcripts, functionCalls, activeCall, getCallDetails };
}
