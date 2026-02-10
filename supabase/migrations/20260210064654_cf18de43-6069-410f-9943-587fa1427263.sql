
-- Create calls table
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vapi_call_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'in-progress',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create transcripts table
CREATE TABLE public.transcripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function_calls table
CREATE TABLE public.function_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  function_name TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.function_calls ENABLE ROW LEVEL SECURITY;

-- Public read policies (no auth needed for this app)
CREATE POLICY "Allow public read on calls" ON public.calls FOR SELECT USING (true);
CREATE POLICY "Allow public read on transcripts" ON public.transcripts FOR SELECT USING (true);
CREATE POLICY "Allow public read on function_calls" ON public.function_calls FOR SELECT USING (true);

-- Service role insert/update policies for edge function (via service_role key)
CREATE POLICY "Allow service insert on calls" ON public.calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on calls" ON public.calls FOR UPDATE USING (true);
CREATE POLICY "Allow service insert on transcripts" ON public.transcripts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service insert on function_calls" ON public.function_calls FOR INSERT WITH CHECK (true);

-- Enable realtime on all three tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transcripts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.function_calls;
