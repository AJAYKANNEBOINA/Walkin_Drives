import { doc, getDoc, setDoc, collection, getDocs, where, query } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { db, isConfigured } from '@/lib/firebase'

export interface JobAlert {
  id:         string
  user_id:    string
  email:      string
  cities:     string[]
  experience: string | null
  mode:       string | null
  keywords:   string[]
  is_active:  boolean
  created_at: string
}

export interface JobAlertPayload {
  email:      string
  cities:     string[]
  experience: string
  mode:       string
  keywords:   string[]
}

export async function fetchMyAlert(userId: string): Promise<JobAlert | null> {
  if (!isConfigured) return null

  const snap = await getDoc(doc(db, 'job_alerts', userId))
  if (!snap.exists()) return null

  const data = snap.data()
  if (!data.is_active) return null

  return { id: snap.id, ...data } as JobAlert
}

export async function saveAlert(payload: JobAlertPayload, userId: string): Promise<void> {
  await setDoc(doc(db, 'job_alerts', userId), {
    user_id:    userId,
    email:      payload.email,
    cities:     payload.cities,
    experience: payload.experience || null,
    mode:       payload.mode       || null,
    keywords:   payload.keywords,
    is_active:  true,
    created_at: new Date().toISOString(),
  }, { merge: true })
}

export async function deleteAlert(alertId: string): Promise<void> {
  await setDoc(doc(db, 'job_alerts', alertId), { is_active: false }, { merge: true })
}

// ── Send job alert emails via EmailJS (no backend needed) ────────────────────
export async function sendJobAlertEmails(driveId: string): Promise<void> {
  const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('[alerts] EmailJS keys not set — skipping email alerts')
    return
  }

  // Fetch the approved drive
  const driveSnap = await getDoc(doc(db, 'drives', driveId))
  if (!driveSnap.exists()) {
    console.warn('[alerts] Drive not found:', driveId)
    return
  }
  const drive = driveSnap.data()

  // Fetch all active job alerts
  const alertsSnap = await getDocs(
    query(collection(db, 'job_alerts'), where('is_active', '==', true))
  )

  if (alertsSnap.empty) {
    console.log('[alerts] No active job alerts found')
    return
  }

  let sent = 0
  let skipped = 0

  for (const alertDoc of alertsSnap.docs) {
    const alert = alertDoc.data()

    if (!alert.email) { skipped++; continue }

    // ── Match filters (AND logic — all set filters must match) ───
    if (alert.cities?.length > 0 && !alert.cities.includes(drive.city)) { skipped++; continue }
    if (alert.experience && alert.experience !== drive.experience)        { skipped++; continue }
    if (alert.mode       && alert.mode       !== drive.mode)              { skipped++; continue }

    if (alert.keywords?.length > 0) {
      const text = `${drive.role} ${drive.city}`.toLowerCase()
      const match = alert.keywords.some((kw: string) => text.includes(kw.toLowerCase()))
      if (!match) { skipped++; continue }
    }

    // ── Send email ────────────────────────────────────────────────
    const templateParams = {
      to_email:   alert.email,
      role:       drive.role,
      company:    drive.company_name,
      city:       drive.city,
      drive_date: new Date(drive.drive_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      drive_time: drive.drive_time,
      experience: drive.experience,
      salary:     drive.salary || 'Not disclosed',
      openings:   drive.openings ? `${drive.openings} openings` : '',
      drive_link: `${window.location.origin}/drives/${driveId}`,
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      sent++
      console.log(`✅ Alert sent to ${alert.email}`)
    } catch (err) {
      console.error(`❌ Failed to send to ${alert.email}:`, err)
    }
  }

  console.log(`[alerts] Done — sent: ${sent}, skipped (no match): ${skipped}`)
}
