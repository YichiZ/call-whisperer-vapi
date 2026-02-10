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

export function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {status === "in-progress" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`} />
        )}
        <span className={`relative inline-flex h-3 w-3 rounded-full ${config.color}`} />
      </span>
      <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
    </div>
  );
}
