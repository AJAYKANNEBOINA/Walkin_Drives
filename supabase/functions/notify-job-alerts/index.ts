import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY   = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { drive_id } = await req.json()
    if (!drive_id) return new Response('Missing drive_id', { status: 400, headers: corsHeaders })

    // Fetch the approved drive
    const { data: drive, error: driveErr } = await supabase
      .from('drives')
      .select('*, company:companies(name, industry)')
      .eq('id', drive_id)
      .single()

    if (driveErr || !drive) {
      return new Response('Drive not found', { status: 404, headers: corsHeaders })
    }

    // Fetch all active alerts
    const { data: alerts } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('is_active', true)

    if (!alerts || alerts.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: 'no alerts' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Filter matching alerts
    const matched = alerts.filter((alert) => {
      if (alert.cities?.length > 0 && !alert.cities.includes(drive.city))     return false
      if (alert.experience && alert.experience !== drive.experience)            return false
      if (alert.mode       && alert.mode       !== drive.mode)                 return false
      if (alert.keywords?.length > 0) {
        const roleLC = drive.role.toLowerCase()
        if (!alert.keywords.some((kw: string) => roleLC.includes(kw.toLowerCase()))) return false
      }
      return true
    })

    if (matched.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: 'no matching alerts' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Send emails
    const driveDate = new Date(drive.drive_date).toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

    const results = await Promise.allSettled(
      matched.map((alert) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from:    'WalkinDrives <onboarding@resend.dev>',
            to:      [alert.email],
            subject: `🚶 New Walk-in Drive: ${drive.role} at ${drive.company.name}`,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f4f4f5;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e4e4e7;">
    <div style="background:linear-gradient(135deg,#1e2d5a,#2d4a8a);padding:28px 32px;">
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">WalkinDrives.in</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#fff;font-weight:800;">New Walk-in Drive Match!</h1>
    </div>
    <div style="padding:28px 32px;">
      <div style="background:#f8f9ff;border:1px solid #e0e7ff;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:#111;">${drive.role}</p>
        <p style="margin:0 0 16px;font-size:14px;color:#6366f1;font-weight:600;">${drive.company.name}${drive.company.industry ? ` · ${drive.company.industry}` : ''}</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;width:120px;">📅 Date</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">${driveDate}</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;">⏰ Timing</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">${drive.drive_time}</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;">📍 Location</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">${drive.location}, ${drive.city}</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#6b7280;">💼 Experience</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">${drive.experience}</td></tr>
          ${drive.salary   ? `<tr><td style="padding:5px 0;font-size:13px;color:#6b7280;">💰 Salary</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">${drive.salary}</td></tr>` : ''}
          ${drive.openings ? `<tr><td style="padding:5px 0;font-size:13px;color:#6b7280;">👥 Openings</td><td style="padding:5px 0;font-size:13px;color:#111;font-weight:600;">${drive.openings} positions</td></tr>` : ''}
        </table>
      </div>
      <a href="https://walkindrives.in/drives/${drive_id}" style="display:block;text-align:center;background:linear-gradient(135deg,#4f6ef7,#3b5ce6);color:#fff;text-decoration:none;border-radius:50px;padding:14px 32px;font-size:14px;font-weight:700;">
        View Full Drive Details →
      </a>
      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
        You're receiving this because you enabled job alerts on WalkinDrives.in.<br>
        <a href="https://walkindrives.in/job-alerts" style="color:#6366f1;">Manage alerts</a>
      </p>
    </div>
  </div>
</body></html>`,
          }),
        })
      )
    )

    const sent   = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length
    console.log(`Notified ${sent} users, ${failed} failed`)

    return new Response(JSON.stringify({ sent, failed }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(String(err), { status: 500, headers: corsHeaders })
  }
})
