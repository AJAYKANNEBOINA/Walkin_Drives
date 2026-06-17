const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent'

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

export async function extractDriveFromImage(file: File): Promise<Partial<ExtractedDrive>> {
  if (!API_KEY) throw new Error('Gemini API key not configured')

  const base64 = await fileToBase64(file)
  const mimeType = file.type || 'image/jpeg'

  const body = {
    contents: [{
      parts: [
        {
          text: `Extract walk-in drive/job interview details from this image poster.
Return ONLY a valid JSON object with these exact keys (use empty string "" if not found):
{
  "company": "company name",
  "contactEmail": "hr email if visible",
  "role": "job role/position",
  "location": "full venue address",
  "city": "city name only (one of: Bengaluru, Hyderabad, Chennai, Mumbai, Pune, Delhi, Noida, Gurgaon, Kolkata, Ahmedabad, Kochi, Coimbatore)",
  "experience": "experience required (one of: Freshers, 0-1 years, 1-3 years, 3-5 years, 5+ years)",
  "eligibility": "degree/qualification required",
  "salary": "salary/ctc offered",
  "mode": "Onsite or Remote or Hybrid",
  "driveDate": "date in YYYY-MM-DD format",
  "driveTime": "timing like 10:00 AM - 4:00 PM",
  "openings": "number of openings as digits only",
  "description": "brief job description if visible",
  "skills": "required skills comma separated"
}
Return ONLY the JSON object. No markdown, no code blocks, no explanation.`
        },
        {
          inlineData: { mimeType, data: base64 }
        }
      ]
    }],
    generationConfig: { temperature: 0.1 }
  }

  // AQ. keys use Bearer token auth; AIzaSy keys use ?key= query param
  const isBearer = API_KEY.startsWith('AQ.')
  const url = isBearer ? BASE_URL : `${BASE_URL}?key=${API_KEY}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (isBearer) headers['Authorization'] = `Bearer ${API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  console.log('[Gemini raw response]', text)

  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const start = cleaned.indexOf('{')
  const end   = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON in response: ' + cleaned.slice(0, 200))

  return JSON.parse(cleaned.slice(start, end + 1)) as Partial<ExtractedDrive>
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
