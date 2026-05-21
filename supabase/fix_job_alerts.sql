-- ── Add missing columns to existing job_alerts table ─────────────────────
ALTER TABLE public.job_alerts
  ADD COLUMN IF NOT EXISTS email       text,
  ADD COLUMN IF NOT EXISTS cities      text[]      DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience  text        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS mode        text        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS keywords    text[]      DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active   boolean     DEFAULT true;

-- ── Unique index (one active alert per user) ──────────────────────────────
DROP INDEX IF EXISTS job_alerts_user_unique;
CREATE UNIQUE INDEX job_alerts_user_unique
  ON public.job_alerts (user_id)
  WHERE is_active = true;

-- ── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_alerts_select_own" ON public.job_alerts;
DROP POLICY IF EXISTS "job_alerts_insert_own" ON public.job_alerts;
DROP POLICY IF EXISTS "job_alerts_update_own" ON public.job_alerts;
DROP POLICY IF EXISTS "job_alerts_delete_own" ON public.job_alerts;

CREATE POLICY "job_alerts_select_own" ON public.job_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "job_alerts_insert_own" ON public.job_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "job_alerts_update_own" ON public.job_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "job_alerts_delete_own" ON public.job_alerts FOR DELETE USING (auth.uid() = user_id);

-- ── Verify ────────────────────────────────────────────────────────────────
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'job_alerts'
ORDER BY ordinal_position;
