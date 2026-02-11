import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Bot, ClipboardList, Shield, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import faviconIcon from "/favicon.png";

const features = [
  {
    icon: Phone,
    title: "Voice AI Receptionist",
    description: "Handles incoming calls with natural conversation powered by VAPI.",
  },
  {
    icon: Bot,
    title: "Smart Tool Calls",
    description: "Looks up customer info, pet history, books appointments, and more — automatically.",
  },
  {
    icon: ClipboardList,
    title: "Live Transcripts",
    description: "Real-time transcription of every call with full history and search.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Built on Lovable Cloud with role-based access control and encrypted data.",
  },
];

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={faviconIcon} alt="Pawsome Pals" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Pawsome Pals
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          🏆 1st Place Hackathon Winner
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          AI-Powered Voice Receptionist for{" "}
          <span className="text-primary">Veterinary Clinics</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Pawsome Pals handles your clinic calls with a friendly AI voice — looking up patients,
          booking appointments, and ordering medications, all through natural conversation.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/login">
            <Button size="lg" className="gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="https://calendar.app.google/zwcB9EMYnQypw3BW8" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="gap-2">
              Book a Demo
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
            Everything your clinic needs
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title} className="border-border/50">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          Built with ❤️ at a hackathon · Powered by VAPI &amp; Lovable Cloud
        </div>
      </footer>
    </div>
  );
};

export default Landing;
