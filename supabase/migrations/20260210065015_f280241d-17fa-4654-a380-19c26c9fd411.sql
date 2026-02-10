
-- Fix RLS policies: drop restrictive and recreate as permissive

-- calls table
DROP POLICY IF EXISTS "Allow public read on calls" ON public.calls;
DROP POLICY IF EXISTS "Allow service insert on calls" ON public.calls;
DROP POLICY IF EXISTS "Allow service update on calls" ON public.calls;

CREATE POLICY "Allow public read on calls" ON public.calls FOR SELECT USING (true);
CREATE POLICY "Allow service insert on calls" ON public.calls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service update on calls" ON public.calls FOR UPDATE USING (true);

-- transcripts table
DROP POLICY IF EXISTS "Allow public read on transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Allow service insert on transcripts" ON public.transcripts;

CREATE POLICY "Allow public read on transcripts" ON public.transcripts FOR SELECT USING (true);
CREATE POLICY "Allow service insert on transcripts" ON public.transcripts FOR INSERT WITH CHECK (true);

-- function_calls table
DROP POLICY IF EXISTS "Allow public read on function_calls" ON public.function_calls;
DROP POLICY IF EXISTS "Allow service insert on function_calls" ON public.function_calls;

CREATE POLICY "Allow public read on function_calls" ON public.function_calls FOR SELECT USING (true);
CREATE POLICY "Allow service insert on function_calls" ON public.function_calls FOR INSERT WITH CHECK (true);
