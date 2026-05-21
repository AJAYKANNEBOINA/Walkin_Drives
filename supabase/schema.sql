-- ============================================================
-- WalkinDrives.in — Complete Supabase Schema
-- Run this entire file in Supabase SQL Editor (fresh setup)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    text,
  email        text,
  phone        text,
  city         text,
  experience   text,
  skills       text[],
  resume_url   text,
  avatar_url   text,
  is_admin     boolean NOT NULL DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- companies
CREATE TABLE IF NOT EXISTS public.companies (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL UNIQUE,
  logo_url   text,
  industry   text,
  verified   boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- drives
CREATE TABLE IF NOT EXISTS public.drives (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  posted_by     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  role          text NOT NULL,
  location      text NOT NULL,
  city          text NOT NULL,
  experience    text NOT NULL,
  eligibility   text,
  salary        text,
  mode          text NOT NULL CHECK (mode IN ('Onsite', 'Hybrid', 'Remote')),
  drive_date    date NOT NULL,
  drive_time    text NOT NULL,
  description   text,
  skills        text[],
  openings      integer,
  contact_email text,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_priority   boolean DEFAULT false,
  is_active     boolean DEFAULT false,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- applications
CREATE TABLE IF NOT EXISTS public.applications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_id   uuid NOT NULL REFERENCES public.drives(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status     text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'selected', 'rejected')),
  applied_at timestamptz DEFAULT now(),
  UNIQUE(drive_id, user_id)
);

-- job_alerts
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email      text NOT NULL,
  city       text,
  experience text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, city, experience)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'experience'
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- AUTO-EXPIRE FUNCTION + CRON
-- ============================================================

CREATE OR REPLACE FUNCTION public.expire_past_drives()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.drives
  SET is_active = false
  WHERE drive_date < current_date AND is_active = true;
END;
$$;

-- Enable pg_cron and schedule daily expiry at 18:30 UTC (midnight IST)
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'expire-past-drives',
  '30 18 * * *',
  $$ SELECT public.expire_past_drives(); $$
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drives       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Users can view all profiles"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- companies
CREATE POLICY "Anyone can view companies"    ON public.companies FOR SELECT USING (true);
CREATE POLICY "Auth users can upsert companies" ON public.companies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth users can update companies" ON public.companies FOR UPDATE USING (auth.uid() IS NOT NULL);

-- drives
CREATE POLICY "Select drives policy" ON public.drives
  FOR SELECT USING (
    (status = 'approved' AND is_active = true AND drive_date >= current_date)
    OR (auth.uid() = posted_by)
    OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  );

CREATE POLICY "Auth users can post drives" ON public.drives
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Poster can update own drives" ON public.drives
  FOR UPDATE USING (auth.uid() = posted_by);

CREATE POLICY "Admin can update all drives" ON public.drives
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admin can delete drives" ON public.drives
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- applications
CREATE POLICY "Users can view own applications"   ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can apply to drives"         ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can withdraw applications"   ON public.applications FOR DELETE USING (auth.uid() = user_id);

-- job_alerts
CREATE POLICY "Users can view own alerts"   ON public.job_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON public.job_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.job_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.job_alerts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA — 12 Companies
-- ============================================================

INSERT INTO public.companies (id, name, logo_url, industry, verified) VALUES
  ('11111111-0001-0000-0000-000000000000', 'Genpact',                    '/logos/genpact.svg',   'BPM',  true),
  ('11111111-0002-0000-0000-000000000000', 'Capgemini',                  '/logos/capgemini.svg', 'IT',   true),
  ('11111111-0003-0000-0000-000000000000', 'HDFC Life',                  '/logos/hdfc.svg',      'BFSI', true),
  ('11111111-0004-0000-0000-000000000000', 'Hewlett Packard Enterprise',  '/logos/hpe.svg',       'IT',   true),
  ('11111111-0005-0000-0000-000000000000', 'Kotak Mahindra Bank',        '/logos/kotak.svg',     'BFSI', true),
  ('11111111-0006-0000-0000-000000000000', 'TCS',                        '/logos/tcs.svg',       'IT',   true),
  ('11111111-0007-0000-0000-000000000000', 'Wipro',                      '/logos/wipro.svg',     'IT',   true),
  ('11111111-0008-0000-0000-000000000000', 'Infosys BPM',                '/logos/infosys.svg',   'BPM',  true),
  ('11111111-0009-0000-0000-000000000000', 'LTIMindtree',                '/logos/ltim.svg',      'IT',   true),
  ('11111111-0010-0000-0000-000000000000', 'Tech Mahindra',              '/logos/techm.svg',     'IT',   true),
  ('11111111-0011-0000-0000-000000000000', 'ICICI Bank',                 '/logos/icici.svg',     'BFSI', true),
  ('11111111-0012-0000-0000-000000000000', 'Sopra Steria',               '/logos/sopra.svg',     'IT',   true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — 12 Sample Drives (status = approved)
-- ============================================================

INSERT INTO public.drives (company_id, role, location, city, experience, eligibility, salary, mode, drive_date, drive_time, description, skills, openings, is_priority, is_active, status) VALUES

  ('11111111-0001-0000-0000-000000000000', 'Customer Support Associate',
   'Hyderabad, Telangana', 'Hyderabad', '0-1 years', 'Any Graduate', '₹2.5 - 4 LPA', 'Onsite',
   '2026-06-14', '10:00 AM – 4:00 PM',
   'Genpact is hiring Customer Support Associates for their Hyderabad centre. Candidates will handle inbound queries, provide resolutions and maintain customer satisfaction scores.',
   ARRAY['Communication','MS Office','Customer Service'], 45, true, true, 'approved'),

  ('11111111-0002-0000-0000-000000000000', 'Java Full Stack Developer',
   'Bengaluru, Karnataka', 'Bengaluru', '3-5 years', 'B.E / B.Tech / MCA', '₹8 - 14 LPA', 'Hybrid',
   '2026-06-15', '10:00 AM – 2:00 PM',
   'Capgemini is conducting a walk-in drive for experienced Java Full Stack Developers. You will work on enterprise-grade React + Spring Boot applications for global clients.',
   ARRAY['Java','Spring Boot','React','SQL','REST APIs'], 20, true, true, 'approved'),

  ('11111111-0003-0000-0000-000000000000', 'Sales Development Manager',
   'Mumbai, Maharashtra', 'Mumbai', '1-3 years', 'Any Graduate', '₹4 - 7 LPA', 'Onsite',
   '2026-06-15', '9:30 AM – 3:00 PM',
   'HDFC Life is looking for dynamic Sales Development Managers who will manage insurance sales, onboard advisors and meet revenue targets in their territory.',
   ARRAY['Sales','Communication','Insurance Knowledge'], 30, true, true, 'approved'),

  ('11111111-0004-0000-0000-000000000000', 'Server Support Engineer',
   'Bengaluru, Karnataka', 'Bengaluru', '3-5 years', 'B.E / B.Tech (CS / IT / ECE)', '₹7 - 12 LPA', 'Hybrid',
   '2026-06-16', '9:30 AM – 1:30 PM',
   'HPE is hiring Server Support Engineers to provide L2/L3 support for ProLiant and Synergy server lines. Strong Linux and hardware troubleshooting skills required.',
   ARRAY['Linux','Server Hardware','Networking','ITIL'], 15, true, true, 'approved'),

  ('11111111-0005-0000-0000-000000000000', 'Acquisition Manager – CASA',
   'Pune, Maharashtra', 'Pune', '0-1 years', 'Any Graduate', '₹3 - 5 LPA', 'Onsite',
   '2026-06-16', '10:00 AM – 3:00 PM',
   'Kotak Mahindra Bank is hiring freshers for CASA acquisition roles. You will acquire new savings/current account customers, build relationships and cross-sell banking products.',
   ARRAY['Sales','Communication','Banking Basics'], 25, true, true, 'approved'),

  ('11111111-0008-0000-0000-000000000000', 'Process Associate – Finance & Accounting',
   'Hyderabad, Telangana', 'Hyderabad', '0-1 years', 'B.Com / M.Com / MBA Finance', '₹2.8 - 4.5 LPA', 'Hybrid',
   '2026-06-17', '9:00 AM – 12:30 PM',
   'Infosys BPM is looking for Finance Process Associates for their F&A division. You will handle AP/AR processing, reconciliations and month-end close activities.',
   ARRAY['Accounting','Tally','MS Excel','Finance'], 60, false, true, 'approved'),

  ('11111111-0009-0000-0000-000000000000', 'Senior Software Engineer – Full Stack',
   'Bengaluru, Karnataka', 'Bengaluru', '5-8 years', 'B.E / B.Tech / MCA', '₹15 - 22 LPA', 'Hybrid',
   '2026-06-17', '9:30 AM – 1:00 PM',
   'LTIMindtree is conducting a senior-level walk-in for Full Stack engineers proficient in React + Node.js. You will architect and deliver features for Fortune 500 clients.',
   ARRAY['React','Node.js','TypeScript','AWS','Microservices'], 10, true, true, 'approved'),

  ('11111111-0010-0000-0000-000000000000', 'Network Engineer',
   'Hyderabad, Telangana', 'Hyderabad', '1-3 years', 'B.E / B.Tech with CCNA', '₹4 - 7 LPA', 'Onsite',
   '2026-06-18', '9:00 AM – 1:00 PM',
   'Tech Mahindra is hiring Network Engineers for their Hyderabad NOC. You will monitor, configure and troubleshoot enterprise network infrastructure for global clients.',
   ARRAY['CCNA','Cisco','Routing & Switching','Networking'], 18, false, true, 'approved'),

  ('11111111-0011-0000-0000-000000000000', 'Relationship Manager – Retail Banking',
   'Chennai, Tamil Nadu', 'Chennai', '1-3 years', 'Any Graduate / MBA', '₹5 - 8 LPA', 'Onsite',
   '2026-06-18', '9:30 AM – 2:00 PM',
   'ICICI Bank is hiring Relationship Managers for retail banking. You will manage an HNI portfolio, offer financial planning advice and drive cross-sell revenue.',
   ARRAY['Relationship Management','Banking','Sales','Communication'], 22, false, true, 'approved'),

  ('11111111-0012-0000-0000-000000000000', 'SAP Consultant (MM/SD)',
   'Noida, Uttar Pradesh', 'Delhi NCR', '3-5 years', 'Any Graduate with SAP Certification', '₹10 - 18 LPA', 'Hybrid',
   '2026-06-19', '9:30 AM – 1:30 PM',
   'Sopra Steria is looking for experienced SAP MM/SD consultants for their digital transformation engagements. Minimum 2 full lifecycle implementations required.',
   ARRAY['SAP MM','SAP SD','ABAP Basics','S/4HANA'], 8, true, true, 'approved'),

  ('11111111-0006-0000-0000-000000000000', 'Software Engineer – .NET',
   'Pune, Maharashtra', 'Pune', '1-3 years', 'B.E / B.Tech / MCA', '₹5 - 9 LPA', 'Hybrid',
   '2026-06-20', '10:00 AM – 3:00 PM',
   'TCS is hiring .NET developers for their BFSI vertical. You will work on C# / ASP.NET Core applications and participate in the full SDLC.',
   ARRAY['C#','ASP.NET Core','SQL Server','Azure','REST APIs'], 35, false, true, 'approved'),

  ('11111111-0007-0000-0000-000000000000', 'Data Engineer',
   'Bengaluru, Karnataka', 'Bengaluru', '3-5 years', 'B.E / B.Tech / M.Tech', '₹10 - 16 LPA', 'Hybrid',
   '2026-06-20', '9:00 AM – 1:00 PM',
   'Wipro is conducting a walk-in drive for Data Engineers with hands-on experience on cloud data platforms. You will design and maintain ETL pipelines for analytics workloads.',
   ARRAY['Python','Spark','AWS Glue','Redshift','SQL','Airflow'], 12, false, true, 'approved');

-- ============================================================
-- ADMIN SETUP INSTRUCTIONS
-- After running this schema, create your admin account via /register
-- then run:
-- UPDATE public.profiles SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@walkindrives.in');
-- ============================================================
