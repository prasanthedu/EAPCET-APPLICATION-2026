
/* 
  MPC STACK - EAPCET 2026 
  PRO-GRADE DATABASE SETUP SCRIPT
*/

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
    email TEXT, -- Added email column
    apaar TEXT,
    ration_card TEXT,
    category TEXT NOT NULL,
    sub_caste TEXT,
    income_certificate TEXT,
    caste_ews_certificate TEXT,
    tenth_hall_ticket TEXT,
    practical_hall_ticket TEXT,
    jee_mains_no TEXT DEFAULT '',
    street TEXT,
    village_city TEXT,
    district TEXT,
    state TEXT,
    pincode TEXT,
    nation TEXT DEFAULT 'INDIA',
    school_6_name TEXT, school_6_place TEXT,
    school_7_name TEXT, school_7_place TEXT,
    school_8_name TEXT, school_8_place TEXT,
    school_9_name TEXT, school_9_place TEXT,
    school_10_name TEXT, school_10_place TEXT,
    photo_url TEXT,
    signature_url TEXT,
    application_status TEXT DEFAULT 'Pending',
    admin_message TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='applications' AND column_name='email') THEN
        ALTER TABLE public.applications ADD COLUMN email TEXT;
    END IF;
END $$;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON public.applications;
CREATE POLICY "Public Access" ON public.applications FOR ALL TO anon USING (true) WITH CHECK (true);

GRANT ALL ON TABLE public.applications TO anon;
GRANT ALL ON TABLE public.applications TO authenticated;
GRANT ALL ON TABLE public.applications TO service_role;
