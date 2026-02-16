
/* 
  MPC STACK - EAPCET 2026 
  DATABASE REPAIR SCRIPT
  Run this in your Supabase SQL Editor.
*/

-- 1. Create or Update the table with all required columns
-- Using DO block to handle column additions safely
DO $$ 
BEGIN
    -- Core Application Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='admin_message') THEN
        ALTER TABLE public.applications ADD COLUMN admin_message TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='apaar') THEN
        ALTER TABLE public.applications ADD COLUMN apaar TEXT DEFAULT 'N/A';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='alternate_mobile_number') THEN
        ALTER TABLE public.applications ADD COLUMN alternate_mobile_number TEXT DEFAULT 'N/A';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='mobile_number') THEN
        ALTER TABLE public.applications ADD COLUMN mobile_number TEXT DEFAULT 'N/A';
    END IF;
END $$;

-- 2. Ensure Permissions are fully open for the Admin Dashboard
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON public.applications;
DROP POLICY IF EXISTS "Enable all for anon" ON public.applications;

-- Create a fresh universal policy
CREATE POLICY "Public Access" ON public.applications 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

-- 3. Grant table access to the anonymous role
GRANT ALL ON TABLE public.applications TO anon;
GRANT ALL ON TABLE public.applications TO authenticated;
GRANT ALL ON TABLE public.applications TO service_role;
