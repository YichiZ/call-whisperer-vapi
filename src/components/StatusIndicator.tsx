import { useState, useEffect, useRef } from "react";
import type { CallStatus } from "@/hooks/useVapiCall";

interface StatusIndicatorProps {
  status: CallStatus;
}

const statusConfig: Record<CallStatus, { label: string; color: string }> = {
  idle: { label: "Ready", color: "bg-muted-foreground" },
  connecting: { label: "Connecting", color: "bg-warning" },
  "in-progress": { label: "In Progress", color: "bg-primary" },
  ended: { label: "Ended", color: "bg-muted-foreground" },
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "in-progress") {
      setElapsed(0);
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (status === "idle") setElapsed(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {status === "in-progress" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`} />
        )}
        <span className={`relative inline-flex h-3 w-3 rounded-full ${config.color}`} />
      </span>
      <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
      {(status === "in-progress" || status === "ended") && (
        <span className="ml-1 text-sm tabular-nums text-muted-foreground">
          {formatElapsed(elapsed)}
        </span>
      )}
    </div>
  );
}
