import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Resend } from 'resend'

admin.initializeApp()
const db = admin.firestore()

// ─── Triggered when a drive document is updated ───────────────────────────────
export const onDriveApproved = functions.firestore
  .document('drives/{driveId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after  = change.after.data()

    // Only fire when status changes to 'approved'
    if (before.status === 'approved' || after.status !== 'approved') return null

    const driveId = context.params.driveId
    console.log(`Drive ${driveId} approved — sending job alerts`)

    const drive = after

    // Fetch all active job alerts
    const alertsSnap = await db
      .collection('job_alerts')
      .where('is_active', '==', true)
      .get()

    if (alertsSnap.empty) {
      console.log('No active job alerts found')
      return null
    }

    const resend = new Resend(functions.config().resend.api_key)
    const emailsSent: string[] = []

    for (const alertDoc of alertsSnap.docs) {
      const alert = alertDoc.data()

      if (!alert.email) continue

      // ── Match logic ──────────────────────────────────────────────
      // City match (empty = all cities)
      if (alert.cities?.length > 0 && !alert.cities.includes(drive.city)) continue

      // Experience match (empty = any)
      if (alert.experience && alert.experience !== drive.experience) continue

      // Mode match (empty = any)
      if (alert.mode && alert.mode !== drive.mode) continue

      // Keywords match — role must contain at least one keyword
      if (alert.keywords?.length > 0) {
        const roleText = (drive.role + ' ' + drive.city).toLowerCase()
        const hasKeyword = alert.keywords.some((kw: string) =>
          roleText.includes(kw.toLowerCase())
        )
        if (!hasKeyword) continue
      }

      // ── Send email ───────────────────────────────────────────────
      try {
        await resend.emails.send({
          from:    'Walkins <alerts@walkins.in>',   // replace with your verified domain
          to:      alert.email,
          subject: `New Walk-in Drive: ${drive.role} at ${drive.company_name} — ${drive.city}`,
          html:    buildEmailHtml(drive, driveId),
        })
        emailsSent.push(alert.email)
        console.log(`Alert sent to ${alert.email}`)
      } catch (err) {
        console.error(`Failed to send to ${alert.email}:`, err)
      }
    }

    console.log(`Job alerts sent to ${emailsSent.length} subscriber(s)`)
    return null
  })

// ─── Email HTML template ──────────────────────────────────────────────────────
function buildEmailHtml(drive: FirebaseFirestore.DocumentData, driveId: string): string {
  const driveDate = new Date(drive.drive_date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Walk-in Drive Alert</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;border-radius:12px 12px 0 0;padding:24px 32px;">
              <h1 style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Walkins</h1>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.45);">Your job alert has a match</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;">

              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.5;">
                A new walk-in drive matching your preferences just went live:
              </p>

              <!-- Drive card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:19px;font-weight:800;color:#111827;">${drive.role}</p>
                    <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">${drive.company_name} &nbsp;·&nbsp; ${drive.city}</p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:20px;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Date</p>
                          <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#111827;">${driveDate}</p>
                        </td>
                        <td style="padding-right:20px;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Time</p>
                          <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#111827;">${drive.drive_time}</p>
                        </td>
                        <td style="padding-right:20px;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Experience</p>
                          <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#111827;">${drive.experience}</p>
                        </td>
                        ${drive.openings ? `
                        <td>
                          <p style="margin:0;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Openings</p>
                          <p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#111827;">${drive.openings}</p>
                        </td>` : ''}
                      </tr>
                    </table>

                    ${drive.salary ? `<p style="margin:16px 0 0;font-size:15px;font-weight:700;color:#2563eb;">${drive.salary} <span style="font-weight:400;font-size:12px;color:#9ca3af;">per annum</span></p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://walkins.in/drives/${driveId}"
                       style="display:inline-block;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:-0.2px;">
                      View Drive Details →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">
                You're receiving this because you set up a job alert on Walkins.<br/>
                <a href="https://walkins.in/job-alerts" style="color:#6b7280;text-decoration:underline;">Manage your alerts</a>
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
