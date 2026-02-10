import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { message } = body;

    console.log("Received VAPI webhook:", JSON.stringify(message));

    if (!message || !message.type) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const type = message.type;
    const call = message.call;
    const callId = call?.id;

    switch (type) {
      case "assistant-request": {
        // Return empty to use default assistant config
        return new Response(JSON.stringify({}), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "status-update": {
        const status = message.status;
        if (status === "in-progress" && callId) {
          // Create call record
          const { error } = await supabase.from("calls").upsert(
            { vapi_call_id: callId, status: "in-progress" },
            { onConflict: "vapi_call_id" }
          );
          if (error) console.error("Error creating call:", error);
        } else if (status === "ended" && callId) {
          const { error } = await supabase
            .from("calls")
            .update({ status: "ended", ended_at: new Date().toISOString() })
            .eq("vapi_call_id", callId);
          if (error) console.error("Error ending call:", error);
        }
        break;
      }

      case "transcript": {
        if (!callId) break;
        const role = message.role || "unknown";
        const text = message.transcript || "";
        const transcriptType = message.transcriptType;

        // Only store final transcripts
        if (transcriptType !== "final") break;
        if (!text.trim()) break;

        // Get internal call id
        const { data: callData } = await supabase
          .from("calls")
          .select("id")
          .eq("vapi_call_id", callId)
          .single();

        if (callData) {
          const { error } = await supabase
            .from("transcripts")
            .insert({ call_id: callData.id, role, text });
          if (error) console.error("Error inserting transcript:", error);
        }
        break;
      }

      case "function-call":
      case "tool-calls": {
        if (!callId) break;

        const { data: callData } = await supabase
          .from("calls")
          .select("id")
          .eq("vapi_call_id", callId)
          .single();

        if (!callData) break;

        if (type === "tool-calls" && message.toolCallList) {
          for (const toolCall of message.toolCallList) {
            const fn = toolCall.function;
            if (fn) {
              const { error } = await supabase.from("function_calls").insert({
                call_id: callData.id,
                function_name: fn.name || "unknown",
                parameters: fn.arguments ? JSON.parse(fn.arguments) : {},
              });
              if (error) console.error("Error inserting function call:", error);
            }
          }
        } else if (type === "function-call") {
          const { error } = await supabase.from("function_calls").insert({
            call_id: callData.id,
            function_name: message.functionCall?.name || "unknown",
            parameters: message.functionCall?.parameters || {},
          });
          if (error) console.error("Error inserting function call:", error);
        }
        break;
      }

      case "end-of-call-report": {
        if (!callId) break;
        const { error } = await supabase
          .from("calls")
          .update({ status: "ended", ended_at: new Date().toISOString() })
          .eq("vapi_call_id", callId);
        if (error) console.error("Error updating call on report:", error);
        break;
      }

      default:
        console.log("Unhandled message type:", type);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
