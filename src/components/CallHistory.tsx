import { useState } from "react";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import type { CallWithDetails } from "@/hooks/useCallData";
import { format } from "date-fns";

interface CallHistoryProps {
  calls: CallWithDetails[];
}

export function CallHistory({ calls }: CallHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (calls.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No call history yet. Start a call above!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {calls.map((call) => {
        const isExpanded = expandedId === call.id;
        return (
          <div key={call.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedId(isExpanded ? null : call.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-card-foreground">
                  {format(new Date(call.started_at), "MMM d, yyyy h:mm a")}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    call.status === "in-progress"
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {call.status}
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-border px-4 py-3 space-y-2">
                {call.transcripts.length === 0 && call.function_calls.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No transcript data available.</p>
                ) : (
                  <>
                    {call.transcripts.map((t) => (
                      <div key={t.id} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-1.5 text-xs ${
                            t.role === "user"
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span className="font-semibold">{t.role === "user" ? "You" : "Assistant"}: </span>
                          {t.text}
                        </div>
                      </div>
                    ))}
                    {call.function_calls.map((f) => (
                      <div key={f.id} className="flex justify-center">
                        <div className="rounded-md bg-accent px-2 py-1 text-xs">
                          ⚡ {f.function_name}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
