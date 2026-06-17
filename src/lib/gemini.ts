import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string

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

  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

  const base64 = await fileToBase64(file)

  // Ensure mime type is valid for Gemini
  const mimeType = file.type || 'image/jpeg'

  const prompt = `Extract walk-in drive/job interview details from this image poster.
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

  const result = await model.generateContent([
    { text: prompt },
    { inlineData: { mimeType, data: base64 } },
  ])

  const text = result.response.text().trim()
  console.log('[Gemini raw response]', text)

  // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const start = cleaned.indexOf('{')
  const end   = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON found in Gemini response: ' + cleaned)

  const json = cleaned.slice(start, end + 1)
  return JSON.parse(json) as Partial<ExtractedDrive>
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
