import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tables } from "@/integrations/supabase/types";
import type { LocalTranscript } from "@/hooks/useVapiCall";

type Transcript = Tables<"transcripts">;
type FunctionCall = Tables<"function_calls">;

interface TranscriptAreaProps {
  dbTranscripts: Transcript[];
  localTranscripts: LocalTranscript[];
  functionCalls: FunctionCall[];
}

export function TranscriptArea({ dbTranscripts, localTranscripts, functionCalls }: TranscriptAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Merge db + local, preferring db for finals
  const items = dbTranscripts.length > 0 ? dbTranscripts : [];
  const partials = localTranscripts.filter((t) => !t.isFinal);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items, partials, functionCalls]);

  if (items.length === 0 && partials.length === 0 && functionCalls.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
        Transcript will appear here during the call...
      </div>
    );
  }

  // Build a timeline from db transcripts and function calls
  type TimelineItem =
    | { type: "transcript"; data: Transcript }
    | { type: "function_call"; data: FunctionCall };

  const timeline: TimelineItem[] = [
    ...items.map((t) => ({ type: "transcript" as const, data: t })),
    ...functionCalls.map((f) => ({ type: "function_call" as const, data: f })),
  ].sort((a, b) => new Date(a.data.created_at).getTime() - new Date(b.data.created_at).getTime());

  return (
    <ScrollArea className="h-64 w-full rounded-md border border-border bg-muted/30 p-1" ref={scrollRef as any}>
      <div className="space-y-2 p-3">
        {timeline.map((item) =>
          item.type === "transcript" ? (
            <div
              key={item.data.id}
              className={`flex ${item.data.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  item.data.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border border-border"
                }`}
              >
                <span className="text-xs font-semibold opacity-70 block mb-0.5">
                  {item.data.role === "user" ? "You" : "Assistant"}
                </span>
                {item.data.text}
              </div>
            </div>
          ) : (
            <div key={item.data.id} className="flex justify-center">
              <div className="rounded-lg bg-accent border border-border px-3 py-2 text-xs max-w-[90%]">
                <span className="font-semibold text-accent-foreground">
                  ⚡ {item.data.function_name}
                </span>
                {item.data.parameters && Object.keys(item.data.parameters as object).length > 0 && (
                  <pre className="mt-1 text-muted-foreground overflow-x-auto">
                    {JSON.stringify(item.data.parameters, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )
        )}

        {/* Show local partials */}
        {partials.map((p, i) => (
          <div key={`partial-${i}`} className={`flex ${p.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm opacity-60 ${
                p.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground border border-border"
              }`}
            >
              <span className="text-xs font-semibold opacity-70 block mb-0.5">
                {p.role === "user" ? "You" : "Assistant"}
              </span>
              {p.text}
              <span className="animate-pulse ml-1">●</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
