import { Mic, MicOff, Phone } from "lucide-react";
import type { CallStatus } from "@/hooks/useVapiCall";
import { AudioWaveform } from "@/components/AudioWaveform";

interface CallButtonProps {
  status: CallStatus;
  onToggle: () => void;
  volumeLevel?: number;
}

export function CallButton({ status, onToggle, volumeLevel = 0 }: CallButtonProps) {
  const isActive = status === "in-progress";
  const isConnecting = status === "connecting";
  const getVolume = () => volumeLevel;

  return (
    <div className="relative flex items-center justify-center">
      {/* Audio waveform */}
      <AudioWaveform isActive={isActive} getVolume={getVolume} />
      {isActive && (
        <>
          <span className="absolute h-24 w-24 rounded-full bg-primary/30 animate-pulse-ring" />
          <span className="absolute h-24 w-24 rounded-full bg-primary/20 animate-pulse-ring [animation-delay:0.5s]" />
        </>
      )}

      <button
        onClick={onToggle}
        disabled={isConnecting}
        className={`
          relative z-10 flex h-20 w-20 items-center justify-center rounded-full
          transition-all duration-300 shadow-lg
          ${isActive
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 scale-110"
            : isConnecting
            ? "bg-muted text-muted-foreground cursor-wait"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
          }
        `}
      >
        {isConnecting ? (
          <Phone className="h-8 w-8 animate-pulse" />
        ) : isActive ? (
          <MicOff className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>

      <p className="absolute -bottom-10 text-sm font-medium text-muted-foreground whitespace-nowrap">
        {isConnecting
          ? "Connecting..."
          : isActive
          ? "Tap to end call"
          : status === "ended"
          ? "Call ended"
          : "Tap to call"}
      </p>
    </div>
  );
}
