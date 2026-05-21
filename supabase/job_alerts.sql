-- ── Job Alerts table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email       text NOT NULL,
  cities      text[]    DEFAULT '{}',
  experience  text      DEFAULT NULL,   -- NULL means "any"
  mode        text      DEFAULT NULL,   -- NULL means "any"
  keywords    text[]    DEFAULT '{}',   -- matched against role name
  is_active   boolean   DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- One active alert per user (upsert friendly)
CREATE UNIQUE INDEX IF NOT EXISTS job_alerts_user_unique
  ON public.job_alerts (user_id)
  WHERE is_active = true;

-- RLS
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_alerts_select_own" ON public.job_alerts;
DROP POLICY IF EXISTS "job_alerts_insert_own" ON public.job_alerts;
DROP POLICY IF EXISTS "job_alerts_update_own" ON public.job_alerts;
DROP POLICY IF EXISTS "job_alerts_delete_own" ON public.job_alerts;

CREATE POLICY "job_alerts_select_own" ON public.job_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "job_alerts_insert_own" ON public.job_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "job_alerts_update_own" ON public.job_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "job_alerts_delete_own" ON public.job_alerts FOR DELETE USING (auth.uid() = user_id);

-- ── Trigger: call edge function when a drive is approved ──────────────────
-- This fires the 'notify-job-alerts' edge function via pg_net whenever
-- a drive's status changes to 'approved'.

CREATE OR REPLACE FUNCTION public.notify_drive_approved()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Only fire when status flips to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    PERFORM net.http_post(
      url     := current_setting('app.supabase_url') || '/functions/v1/notify-job-alerts',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body    := jsonb_build_object('drive_id', NEW.id)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_drive_approved ON public.drives;
CREATE TRIGGER on_drive_approved
  AFTER UPDATE ON public.drives
  FOR EACH ROW EXECUTE FUNCTION public.notify_drive_approved();

-- ── Set app settings (run once, replace values) ───────────────────────────
-- Run these in Supabase SQL editor replacing with your actual values:
-- ALTER DATABASE postgres SET app.supabase_url = 'https://depyjnxmkfgvcohuugef.supabase.co';
-- ALTER DATABASE postgres SET app.service_role_key = '<your-service-role-key>';
