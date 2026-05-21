-- ============================================================
-- WalkinDrives.in — Schema Updates
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- 0. Backfill email into profiles from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

-- 1a. Add missing columns to drives
ALTER TABLE public.drives
  ADD COLUMN IF NOT EXISTS posted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 1. Add status column to drives
ALTER TABLE public.drives
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- 2. Add contact_email column to drives
ALTER TABLE public.drives
  ADD COLUMN IF NOT EXISTS contact_email text;

-- 3. Add is_admin to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- 4. Mark all existing seed drives as approved
UPDATE public.drives SET status = 'approved';

-- ============================================================
-- UPDATE RLS POLICIES FOR DRIVES
-- ============================================================

-- Drop old public select policy
DROP POLICY IF EXISTS "Anyone can view active drives" ON public.drives;
DROP POLICY IF EXISTS "Anyone can view approved active drives" ON public.drives;
DROP POLICY IF EXISTS "Admin can view all drives" ON public.drives;
DROP POLICY IF EXISTS "Admin can update all drives" ON public.drives;
DROP POLICY IF EXISTS "Select drives policy" ON public.drives;

-- Single unified SELECT policy
CREATE POLICY "Select drives policy" ON public.drives
  FOR SELECT USING (
    -- Public sees only approved, active, non-expired drives
    (status = 'approved' AND is_active = true AND drive_date >= current_date)
    OR
    -- Poster can always see their own submissions
    (auth.uid() = posted_by)
    OR
    -- Admin sees everything
    (EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    ))
  );

-- Admin can approve/reject (update status)
CREATE POLICY "Admin can update all drives" ON public.drives
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admin can delete drives
CREATE POLICY "Admin can delete drives" ON public.drives
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================
-- AUTO-EXPIRE FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.expire_past_drives()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.drives
  SET is_active = false
  WHERE drive_date < current_date
    AND is_active = true;
END;
$$;

-- ============================================================
-- pg_cron: Run expire function daily at midnight IST (18:30 UTC)
-- ============================================================

-- Enable pg_cron extension (run once as superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily expiry job
SELECT cron.schedule(
  'expire-past-drives',
  '30 18 * * *',
  $$ SELECT public.expire_past_drives(); $$
);

-- ============================================================
-- ADMIN USER SETUP
-- Step 1: Sign up at /register with email: admin@walkindrives.in
-- Step 2: Run the query below to grant admin access
-- ============================================================

-- Run this AFTER creating the admin account via the app:
-- UPDATE public.profiles SET is_admin = true WHERE email = 'admin@walkindrives.in';
