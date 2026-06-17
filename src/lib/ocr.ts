import Tesseract from 'tesseract.js'

export interface ExtractedDrive {
  company: string
  contactEmail: string
  role: string
  location: string
  city: string
  experience: string
  eligibility: string
  salary: string
  mode: string
  driveDate: string
  driveTime: string
  openings: string
  description: string
  skills: string
}

export async function extractDriveFromImage(
  file: File,
  onProgress?: (pct: number) => void
): Promise<Partial<ExtractedDrive>> {
  const result = await Tesseract.recognize(file, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  const text = result.data.text
  console.log('[Tesseract OCR raw]', text)
  return parseOcrText(text)
}

// ─── helpers ────────────────────────────────────────────────────────────────

function find(text: string, patterns: RegExp[]): string {
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return (m[1] ?? m[0]).trim()
  }
  return ''
}

const CITIES = [
  'Bengaluru', 'Bangalore', 'Hyderabad', 'Chennai', 'Mumbai', 'Pune',
  'Delhi', 'Noida', 'Gurgaon', 'Gurugram', 'Kolkata', 'Ahmedabad',
  'Kochi', 'Cochin', 'Coimbatore', 'Bhopal', 'Jaipur', 'Nagpur',
]

const CITY_MAP: Record<string, string> = {
  bangalore: 'Bengaluru', bengaluru: 'Bengaluru',
  gurugram: 'Gurgaon', cochin: 'Kochi',
}

function parseOcrText(raw: string): Partial<ExtractedDrive> {
  const text = raw
  const lower = text.toLowerCase()
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  // ── company ──────────────────────────────────────────────────────────────
  // First non-empty line after cleaning often has company name; also look for explicit label
  const company =
    find(text, [
      /(?:company|organization|org|employer)[:\s]+([^\n]+)/i,
      /(?:^|\n)([A-Z][A-Za-z0-9 &.,'-]{2,40}(?:Pvt\.?\s*Ltd\.?|Technologies|Solutions|Systems|Infotech|Services|Consultancy|Group|Corp|Inc|Limited)?)/,
    ]) ||
    lines[0] ||
    ''

  // ── role ─────────────────────────────────────────────────────────────────
  const role = find(text, [
    /(?:role|position|designation|job title|post|opening for)[:\s]+([^\n]+)/i,
    /(?:hiring|looking for|vacancy for|walk-?in for)[:\s]+([^\n]+)/i,
  ])

  // ── date ─────────────────────────────────────────────────────────────────
  let driveDate = ''
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})/i,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})[,\s]+(\d{4})/i,
  ]
  for (const p of datePatterns) {
    const m = text.match(p)
    if (m) {
      try {
        const d = new Date(m[0])
        if (!isNaN(d.getTime())) {
          driveDate = d.toISOString().split('T')[0]
          break
        }
        // fallback: DD/MM/YYYY
        if (/^\d/.test(m[0])) {
          const parts = m[0].split(/[\/\-]/)
          if (parts.length === 3) {
            const year = parts[2].length === 2 ? '20' + parts[2] : parts[2]
            driveDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
            break
          }
        }
      } catch {}
    }
  }

  // ── time ─────────────────────────────────────────────────────────────────
  const driveTime = find(text, [
    /(\d{1,2}(?::\d{2})?\s*(?:AM|PM)\s*[-–to]+\s*\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i,
    /time[:\s]+(\d{1,2}(?::\d{2})?\s*(?:AM|PM)[^\n]*)/i,
  ])

  // ── venue / location ─────────────────────────────────────────────────────
  const location = find(text, [
    /(?:venue|address|location)[:\s]+([^\n]+)/i,
    /(?:report to|come to|at)[:\s]+([^\n]+)/i,
  ])

  // ── city ─────────────────────────────────────────────────────────────────
  let city = ''
  for (const c of CITIES) {
    if (lower.includes(c.toLowerCase())) {
      city = CITY_MAP[c.toLowerCase()] ?? c
      break
    }
  }

  // ── experience ───────────────────────────────────────────────────────────
  const expRaw = find(text, [
    /(?:experience|exp)[:\s]+([^\n]+)/i,
    /(\d+\s*[-–+]\s*\d*\s*(?:years?|yrs?))/i,
    /(freshers?|entry.?level|0\s*years?)/i,
  ])
  let experience = ''
  if (/fresh/i.test(expRaw)) experience = 'Freshers'
  else if (/0\s*[-–]\s*1|0\s*to\s*1/i.test(expRaw)) experience = '0-1 years'
  else if (/1\s*[-–]\s*3|1\s*to\s*3/i.test(expRaw)) experience = '1-3 years'
  else if (/3\s*[-–]\s*5|3\s*to\s*5/i.test(expRaw)) experience = '3-5 years'
  else if (/5\s*\+|5\s*to|5\s*[-–]/i.test(expRaw)) experience = '5+ years'
  else if (expRaw) experience = expRaw.slice(0, 30)

  // ── salary ───────────────────────────────────────────────────────────────
  const salary = find(text, [
    /(?:salary|ctc|package|pay)[:\s]+([^\n]+)/i,
    /(\d+(?:\.\d+)?\s*[-–to]+\s*\d+(?:\.\d+)?\s*(?:LPA|lpa|L\s*P\.?\s*A|Lakhs?))/i,
  ])

  // ── openings ─────────────────────────────────────────────────────────────
  const openings = find(text, [
    /(?:openings?|vacancies|positions?|no\.?\s*of\s*(?:positions?|openings?))[:\s]+(\d+)/i,
    /(\d+)\s+(?:openings?|vacancies|positions?)/i,
  ])

  // ── skills ───────────────────────────────────────────────────────────────
  const skills = find(text, [
    /(?:skills?|technology|tech stack|technologies|key skills)[:\s]+([^\n]+)/i,
    /(?:required skills?)[:\s]+([^\n]+)/i,
  ])

  // ── eligibility ──────────────────────────────────────────────────────────
  const eligibility = find(text, [
    /(?:eligibility|qualification|education|degree)[:\s]+([^\n]+)/i,
    /(B\.?E|B\.?Tech|MCA|MBA|B\.?Sc|M\.?Tech|Any\s+Graduate)[^\n]*/i,
  ])

  // ── email ────────────────────────────────────────────────────────────────
  const contactEmail = find(text, [
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
  ])

  // ── mode ─────────────────────────────────────────────────────────────────
  let mode = ''
  if (/\bremote\b/i.test(text)) mode = 'Remote'
  else if (/\bhybrid\b/i.test(text)) mode = 'Hybrid'
  else if (/\bonsite\b|\bon.site\b|\bin.?office\b/i.test(text)) mode = 'Onsite'

  // ── description ──────────────────────────────────────────────────────────
  const description = find(text, [
    /(?:job description|about the role|responsibilities?|about the job)[:\s]+([^\n]+(?:\n[^\n]+){0,2})/i,
  ])

  return {
    company: company.slice(0, 100),
    contactEmail,
    role: role.slice(0, 100),
    location: location.slice(0, 200),
    city,
    experience,
    eligibility: eligibility.slice(0, 100),
    salary: salary.slice(0, 100),
    mode,
    driveDate,
    driveTime: driveTime.slice(0, 50),
    openings,
    description: description.slice(0, 500),
    skills: skills.slice(0, 200),
  }
}
