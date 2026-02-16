
/* 
  MPC STACK - DATABASE REPAIR SCRIPT
  Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
*/

-- 1. Ensure all required columns exist
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS admin_message TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS apaar TEXT DEFAULT 'N/A',
ADD COLUMN IF NOT EXISTS alternate_mobile_number TEXT DEFAULT 'N/A',
ADD COLUMN IF NOT EXISTS mobile_number TEXT DEFAULT 'N/A';

-- 2. Force reset permissions to ensure the "Save" (Update) operation is allowed
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access" ON public.applications;
CREATE POLICY "Public Access" ON public.applications FOR ALL TO anon USING (true) WITH CHECK (true);

-- 3. Confirmation Comment
COMMENT ON COLUMN public.applications.admin_message IS 'Stores status updates visible to students';
