import { PawPrint } from "lucide-react";
import { CallButton } from "@/components/CallButton";
import { StatusIndicator } from "@/components/StatusIndicator";
import { TranscriptArea } from "@/components/TranscriptArea";
import { CallHistory } from "@/components/CallHistory";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useCallData } from "@/hooks/useCallData";

const Index = () => {
  const { status, localTranscripts, toggleCall } = useVapiCall();
  const { calls, activeCall, getCallDetails } = useCallData();

  // Get transcripts/function calls for the active call
  const activeDetails = activeCall ? getCallDetails(activeCall.id) : undefined;
  const dbTranscripts = activeDetails?.transcripts || [];
  const dbFunctionCalls = activeDetails?.function_calls || [];

  // Build call history (exclude active)
  const historyCalls = calls
    .filter((c) => c.status === "ended")
    .map((c) => getCallDetails(c.id)!)
    .filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center gap-3">
        <PawPrint className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Pawsome Vet Clinic
        </h1>
      </div>

      {/* Main call card */}
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Status */}
        <div className="mb-6 flex justify-center">
          <StatusIndicator status={status} />
        </div>

        {/* Call Button */}
        <div className="mb-14 flex justify-center">
          <CallButton status={status} onToggle={toggleCall} />
        </div>

        {/* Transcript */}
        <TranscriptArea
          dbTranscripts={dbTranscripts}
          localTranscripts={localTranscripts}
          functionCalls={dbFunctionCalls}
        />
      </div>

      {/* Call History */}
      <div className="mt-8 w-full max-w-lg">
        <h2 className="mb-3 text-lg font-semibold text-foreground">Call History</h2>
        <CallHistory calls={historyCalls} />
      </div>
    </div>
  );
};

export default Index;
