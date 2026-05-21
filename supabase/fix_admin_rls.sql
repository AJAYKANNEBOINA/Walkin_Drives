-- ── Step 1: Verify admin flag is set ──────────────────────────────────────
SELECT p.id, u.email, p.is_admin
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'admin@walkindrives.in';
-- Should show is_admin = true. If not, run Step 2.

-- ── Step 2: Set admin flag (run if is_admin is null/false) ─────────────────
UPDATE public.profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@walkindrives.in');

-- ── Step 3: Fix RLS — allow users to read their own profile ───────────────
-- Drop any conflicting policies first
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own"          ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.profiles;

-- Recreate clean SELECT policy
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- ── Step 4: Allow users to update their own profile ───────────────────────
DROP POLICY IF EXISTS "Users can update own profile"    ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"             ON public.profiles;

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ── Step 5: Verify policies are in place ──────────────────────────────────
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
