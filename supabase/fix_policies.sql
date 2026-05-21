-- ============================================================
-- Fix: Drop ALL drive policies and recreate cleanly
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop every possible policy name that may exist on drives
DROP POLICY IF EXISTS "Anyone can view active drives"          ON public.drives;
DROP POLICY IF EXISTS "Anyone can view approved active drives" ON public.drives;
DROP POLICY IF EXISTS "Select drives policy"                   ON public.drives;
DROP POLICY IF EXISTS "Auth users can post drives"             ON public.drives;
DROP POLICY IF EXISTS "Poster can update own drives"           ON public.drives;
DROP POLICY IF EXISTS "Admin can update all drives"            ON public.drives;
DROP POLICY IF EXISTS "Admin can delete drives"                ON public.drives;
DROP POLICY IF EXISTS "Admin can view all drives"              ON public.drives;

-- Verify all are gone
SELECT policyname FROM pg_policies WHERE tablename = 'drives';

-- Recreate policies
CREATE POLICY "select_drives" ON public.drives
  FOR SELECT USING (
    (status = 'approved' AND is_active = true AND drive_date >= current_date)
    OR (auth.uid() = posted_by)
    OR (EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    ))
  );

CREATE POLICY "insert_drives" ON public.drives
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "update_own_drives" ON public.drives
  FOR UPDATE USING (auth.uid() = posted_by);

CREATE POLICY "admin_update_drives" ON public.drives
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "admin_delete_drives" ON public.drives
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Verify new policies
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'drives';

-- Verify admin profile
SELECT id, email, is_admin FROM public.profiles WHERE is_admin = true;

-- Verify pending drives exist
SELECT id, role, status, is_active FROM public.drives WHERE status = 'pending';
