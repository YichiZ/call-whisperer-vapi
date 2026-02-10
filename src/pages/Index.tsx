import faviconIcon from "/favicon.png";
import { Phone, History, Activity, PhoneCall, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CallButton } from "@/components/CallButton";
import { StatusIndicator } from "@/components/StatusIndicator";
import { TranscriptArea } from "@/components/TranscriptArea";
import { CallHistory } from "@/components/CallHistory";
import { useVapiCall } from "@/hooks/useVapiCall";
import { useCallData } from "@/hooks/useCallData";
import { format } from "date-fns";

const Index = () => {
  const { status, localTranscripts, volumeLevel, toggleCall } = useVapiCall();
  const { calls, activeCall, getCallDetails } = useCallData();

  const activeDetails = activeCall ? getCallDetails(activeCall.id) : undefined;
  const dbTranscripts = activeDetails?.transcripts || [];
  const dbFunctionCalls = activeDetails?.function_calls || [];

  const historyCalls = calls
    .filter((c) => c.status === "ended")
    .map((c) => getCallDetails(c.id)!)
    .filter(Boolean);

  const totalCalls = calls.filter((c) => c.status === "ended").length;
  const lastCallTime = historyCalls[0]?.started_at
    ? format(new Date(historyCalls[0].started_at), "MMM d, h:mm a")
    : "—";
  const totalTranscripts = historyCalls.reduce((sum, c) => sum + c.transcripts.length, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <img src={faviconIcon} alt="Pawsome Pals" className="h-8 w-8 rounded-lg" />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Pawsome Pals Veterinary
          </h1>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-6">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalls}</div>
              <p className="text-xs text-muted-foreground">completed calls</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Last Call</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastCallTime}</div>
              <p className="text-xs text-muted-foreground">most recent session</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transcript Lines</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTranscripts}</div>
              <p className="text-xs text-muted-foreground">across all calls</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="call" className="space-y-4">
          <TabsList>
            <TabsTrigger value="call" className="gap-2">
              <Phone className="h-4 w-4" />
              Call
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              Call History
            </TabsTrigger>
          </TabsList>

          {/* Call Tab */}
          <TabsContent value="call" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Call control card */}
              <Card>
                <CardHeader>
                  <CardTitle>Voice Call</CardTitle>
                  <CardDescription>
                    Start a conversation with the AI vet receptionist
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 py-8 pb-16">
                  <StatusIndicator status={status} />
                  <div className="py-6">
                    <CallButton status={status} onToggle={toggleCall} volumeLevel={volumeLevel} />
                  </div>
                </CardContent>
              </Card>

              {/* Live transcript card */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Live Transcript</CardTitle>
                  <CardDescription>
                    Real-time conversation feed
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <TranscriptArea
                    dbTranscripts={dbTranscripts}
                    localTranscripts={localTranscripts}
                    functionCalls={dbFunctionCalls}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Call History</CardTitle>
                <CardDescription>
                  Browse past conversations and transcripts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CallHistory calls={historyCalls} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
