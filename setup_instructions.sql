
/* 
  MPC STACK - EAPCET 2026 
  PRO-GRADE DATABASE SETUP SCRIPT
  
  Instructions:
  1. Go to your Supabase Dashboard.
  2. Open the "SQL Editor".
  3. Paste this entire script and click "Run".
*/

-- 1. Create the applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE NOT NULL,
    student_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    aadhaar TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    alternate_mobile_number TEXT,
    apaar TEXT,
    ration_card TEXT,
    category TEXT NOT NULL,
    sub_caste TEXT,
    income_certificate TEXT,
    caste_ews_certificate TEXT,
    tenth_hall_ticket TEXT,
    practical_hall_ticket TEXT,
    jee_mains_no TEXT DEFAULT '', -- Optional field
    
    -- Address Fields
    street TEXT,
    village_city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    nation TEXT DEFAULT 'INDIA',
    
    -- School History Fields
    school_6_name TEXT, school_6_place TEXT,
    school_7_name TEXT, school_7_place TEXT,
    school_8_name TEXT, school_8_place TEXT,
    school_9_name TEXT, school_9_place TEXT,
    school_10_name TEXT, school_10_place TEXT,
    
    -- Document URLs
    photo_url TEXT,
    signature_url TEXT,
    
    -- Status & Admin
    application_status TEXT DEFAULT 'Pending',
    admin_message TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add missing columns to existing table (Idempotent updates)
DO $$ 
BEGIN
    -- Core Application Columns Check
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='admin_message') THEN
        ALTER TABLE public.applications ADD COLUMN admin_message TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='jee_mains_no') THEN
        ALTER TABLE public.applications ADD COLUMN jee_mains_no TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='street') THEN
        ALTER TABLE public.applications ADD COLUMN street TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='village_city') THEN
        ALTER TABLE public.applications ADD COLUMN village_city TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='district') THEN
        ALTER TABLE public.applications ADD COLUMN district TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='state') THEN
        ALTER TABLE public.applications ADD COLUMN state TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='pincode') THEN
        ALTER TABLE public.applications ADD COLUMN pincode TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='nation') THEN
        ALTER TABLE public.applications ADD COLUMN nation TEXT DEFAULT 'INDIA';
    END IF;
END $$;

-- 3. Security Configuration (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Public Select Access" ON public.applications;
DROP POLICY IF EXISTS "Public Insert Access" ON public.applications;
DROP POLICY IF EXISTS "Public Update Access" ON public.applications;
DROP POLICY IF EXISTS "Public Delete Access" ON public.applications;
DROP POLICY IF EXISTS "Public Access" ON public.applications;

-- Create all-inclusive policy for the Application Portal
-- Note: In a real production app, you would restrict Update/Delete to authenticated Admins,
-- but for this setup, we keep it simple as per your requirements.
CREATE POLICY "Public Access" ON public.applications 
FOR ALL TO anon 
USING (true) 
WITH CHECK (true);

-- 4. Grant full permissions to public users
GRANT ALL ON TABLE public.applications TO anon;
GRANT ALL ON TABLE public.applications TO authenticated;
GRANT ALL ON TABLE public.applications TO service_role;

-- 5. Storage Configuration (Bucket Setup Reminder)
/* 
  MANUAL STEP: 
  Please go to Storage > Buckets in Supabase and create a bucket named 'student-documents'. 
  Set the bucket to "Public" so files are accessible for the receipt view.
*/
