
/* 
  MPC STACK - EAPCET 2026 
  DATABASE REPAIR & SCHEMA REFRESH SCRIPT
*/

-- 1. Ensure columns exist (This fixes the 'column not found' error)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='mobile_number') THEN
        ALTER TABLE public.applications ADD COLUMN mobile_number TEXT DEFAULT 'N/A';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='alternate_mobile_number') THEN
        ALTER TABLE public.applications ADD COLUMN alternate_mobile_number TEXT DEFAULT 'N/A';
    END IF;
END $$;

-- 2. Ensure all other mandatory columns are present (Full Schema Alignment)
ALTER TABLE public.applications 
  ALTER COLUMN mobile_number SET NOT NULL,
  ALTER COLUMN alternate_mobile_number SET NOT NULL;

-- 3. Reset Permissions and RLS
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON TABLE public.applications TO anon;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE
  drop_cmd text;
BEGIN
  SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON public.applications;', ' ')
  INTO drop_cmd
  FROM pg_policies 
  WHERE tablename = 'applications' AND schemaname = 'public';
  IF drop_cmd IS NOT NULL THEN EXECUTE drop_cmd; END IF;
END $$;

CREATE POLICY "Public Access" ON public.applications FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. Storage Bucket Repair
-- Ensure bucket 'student-documents' is PUBLIC in the Supabase UI
CREATE POLICY "Universal Access" ON storage.objects FOR ALL TO anon USING (bucket_id = 'student-documents') WITH CHECK (bucket_id = 'student-documents');
