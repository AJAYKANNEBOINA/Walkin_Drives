import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyDdn9g_jIQAPYjJdlXtxLzw6hCU3yts1tQ',
  authDomain:        'walkins-d5153.firebaseapp.com',
  projectId:         'walkins-d5153',
  storageBucket:     'walkins-d5153.firebasestorage.app',
  messagingSenderId: '271774365119',
  appId:             '1:271774365119:web:fead44dd774dd2b73b1d0a',
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

const drives = [
  {
    company_id: 'c1', company_name: 'Genpact', company_industry: 'BPM', company_verified: true, company_logo_url: null,
    role: 'Customer Support Associate', location: 'Hyderabad, Telangana', city: 'Hyderabad',
    experience: '0-1 years', eligibility: 'Any Graduate', salary: '₹2.5 - 4 LPA', mode: 'Onsite',
    drive_date: '2026-07-14', drive_time: '10:00 AM – 4:00 PM', openings: 45,
    skills: ['Communication', 'MS Office', 'Customer Service'],
    description: 'Genpact is hiring Customer Support Associates for their Hyderabad centre. Candidates will handle inbound queries, provide resolutions and maintain customer satisfaction scores.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'hr@genpact.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c2', company_name: 'Capgemini', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Java Full Stack Developer', location: 'Bengaluru, Karnataka', city: 'Bengaluru',
    experience: '3-5 years', eligibility: 'B.E / B.Tech / MCA', salary: '₹8 - 14 LPA', mode: 'Hybrid',
    drive_date: '2026-07-15', drive_time: '10:00 AM – 2:00 PM', openings: 20,
    skills: ['Java', 'Spring Boot', 'React', 'SQL', 'REST APIs'],
    description: 'Capgemini is conducting a walk-in drive for experienced Java Full Stack Developers. You will work on enterprise-grade React + Spring Boot applications for global clients.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'careers@capgemini.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c3', company_name: 'HDFC Life', company_industry: 'BFSI', company_verified: true, company_logo_url: null,
    role: 'Sales Development Manager', location: 'Mumbai, Maharashtra', city: 'Mumbai',
    experience: '1-3 years', eligibility: 'Any Graduate', salary: '₹4 - 7 LPA', mode: 'Onsite',
    drive_date: '2026-07-15', drive_time: '9:30 AM – 3:00 PM', openings: 30,
    skills: ['Sales', 'Communication', 'Insurance Knowledge'],
    description: 'HDFC Life is looking for dynamic Sales Development Managers who will manage insurance sales, onboard advisors and meet revenue targets in their territory.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'hr@hdfclife.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c4', company_name: 'Hewlett Packard Enterprise', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Server Support Engineer', location: 'Bengaluru, Karnataka', city: 'Bengaluru',
    experience: '3-5 years', eligibility: 'B.E / B.Tech (CS / IT / ECE)', salary: '₹7 - 12 LPA', mode: 'Hybrid',
    drive_date: '2026-07-16', drive_time: '9:30 AM – 1:30 PM', openings: 15,
    skills: ['Linux', 'Server Hardware', 'Networking', 'ITIL'],
    description: 'HPE is hiring Server Support Engineers to provide L2/L3 support for ProLiant and Synergy server lines. Strong Linux and hardware troubleshooting skills required.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'careers@hpe.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c5', company_name: 'Kotak Mahindra Bank', company_industry: 'BFSI', company_verified: true, company_logo_url: null,
    role: 'Acquisition Manager – CASA', location: 'Pune, Maharashtra', city: 'Pune',
    experience: '0-1 years', eligibility: 'Any Graduate', salary: '₹3 - 5 LPA', mode: 'Onsite',
    drive_date: '2026-07-16', drive_time: '10:00 AM – 3:00 PM', openings: 25,
    skills: ['Sales', 'Communication', 'Banking Basics'],
    description: 'Kotak Mahindra Bank is hiring freshers for CASA acquisition roles. You will acquire new savings/current account customers and cross-sell banking products.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'hr@kotak.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c8', company_name: 'Infosys BPM', company_industry: 'BPM', company_verified: true, company_logo_url: null,
    role: 'Process Associate – Finance & Accounting', location: 'Hyderabad, Telangana', city: 'Hyderabad',
    experience: '0-1 years', eligibility: 'B.Com / M.Com / MBA Finance', salary: '₹2.8 - 4.5 LPA', mode: 'Hybrid',
    drive_date: '2026-07-17', drive_time: '9:00 AM – 12:30 PM', openings: 60,
    skills: ['Accounting', 'Tally', 'MS Excel', 'Finance'],
    description: 'Infosys BPM is looking for Finance Process Associates for their F&A division. You will handle AP/AR processing, reconciliations and month-end close activities.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@infosysbpm.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c9', company_name: 'LTIMindtree', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Senior Software Engineer – Full Stack', location: 'Bengaluru, Karnataka', city: 'Bengaluru',
    experience: '5-8 years', eligibility: 'B.E / B.Tech / MCA', salary: '₹15 - 22 LPA', mode: 'Hybrid',
    drive_date: '2026-07-17', drive_time: '9:30 AM – 1:00 PM', openings: 10,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Microservices'],
    description: 'LTIMindtree is conducting a senior-level walk-in for Full Stack engineers proficient in React + Node.js. You will architect and deliver features for Fortune 500 clients.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'careers@ltimindtree.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c10', company_name: 'Tech Mahindra', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Network Engineer', location: 'Hyderabad, Telangana', city: 'Hyderabad',
    experience: '1-3 years', eligibility: 'B.E / B.Tech with CCNA', salary: '₹4 - 7 LPA', mode: 'Onsite',
    drive_date: '2026-07-18', drive_time: '9:00 AM – 1:00 PM', openings: 18,
    skills: ['CCNA', 'Cisco', 'Routing & Switching', 'Networking'],
    description: 'Tech Mahindra is hiring Network Engineers for their Hyderabad NOC. You will monitor, configure and troubleshoot enterprise network infrastructure for global clients.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@techmahindra.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c11', company_name: 'ICICI Bank', company_industry: 'BFSI', company_verified: true, company_logo_url: null,
    role: 'Relationship Manager – Retail Banking', location: 'Chennai, Tamil Nadu', city: 'Chennai',
    experience: '1-3 years', eligibility: 'Any Graduate / MBA', salary: '₹5 - 8 LPA', mode: 'Onsite',
    drive_date: '2026-07-18', drive_time: '9:30 AM – 2:00 PM', openings: 22,
    skills: ['Relationship Management', 'Banking', 'Sales', 'Communication'],
    description: 'ICICI Bank is hiring Relationship Managers for retail banking. You will manage an HNI portfolio, offer financial planning advice and drive cross-sell revenue.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@icicibank.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c12', company_name: 'Sopra Steria', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'SAP Consultant (MM/SD)', location: 'Noida, Uttar Pradesh', city: 'Delhi NCR',
    experience: '3-5 years', eligibility: 'Any Graduate with SAP Certification', salary: '₹10 - 18 LPA', mode: 'Hybrid',
    drive_date: '2026-07-19', drive_time: '9:30 AM – 1:30 PM', openings: 8,
    skills: ['SAP MM', 'SAP SD', 'ABAP Basics', 'S/4HANA'],
    description: 'Sopra Steria is looking for experienced SAP MM/SD consultants for their digital transformation engagements. Minimum 2 full lifecycle implementations required.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'hr@soprasteria.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c6', company_name: 'TCS', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Software Engineer – .NET', location: 'Pune, Maharashtra', city: 'Pune',
    experience: '1-3 years', eligibility: 'B.E / B.Tech / MCA', salary: '₹5 - 9 LPA', mode: 'Hybrid',
    drive_date: '2026-07-20', drive_time: '10:00 AM – 3:00 PM', openings: 35,
    skills: ['C#', 'ASP.NET Core', 'SQL Server', 'Azure', 'REST APIs'],
    description: 'TCS is hiring .NET developers for their BFSI vertical. You will work on C# / ASP.NET Core applications and participate in the full SDLC.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@tcs.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c7', company_name: 'Wipro', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Data Engineer', location: 'Bengaluru, Karnataka', city: 'Bengaluru',
    experience: '3-5 years', eligibility: 'B.E / B.Tech / M.Tech', salary: '₹10 - 16 LPA', mode: 'Hybrid',
    drive_date: '2026-07-20', drive_time: '9:00 AM – 1:00 PM', openings: 12,
    skills: ['Python', 'Spark', 'AWS Glue', 'Redshift', 'SQL', 'Airflow'],
    description: 'Wipro is conducting a walk-in drive for Data Engineers with hands-on experience on cloud data platforms. You will design and maintain ETL pipelines for analytics workloads.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'careers@wipro.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c1', company_name: 'Genpact', company_industry: 'BPM', company_verified: true, company_logo_url: null,
    role: 'Data Analyst', location: 'Gurugram, Haryana', city: 'Delhi NCR',
    experience: '1-3 years', eligibility: 'B.E / B.Tech / BCA / MCA', salary: '₹5 - 8 LPA', mode: 'Hybrid',
    drive_date: '2026-07-21', drive_time: '10:00 AM – 2:00 PM', openings: 20,
    skills: ['SQL', 'Power BI', 'Excel', 'Python Basics', 'Data Visualization'],
    description: 'Genpact is hiring Data Analysts for their analytics COE. You will work on dashboards, reports and data pipelines supporting global business operations.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@genpact.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c2', company_name: 'Capgemini', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Cloud DevOps Engineer', location: 'Pune, Maharashtra', city: 'Pune',
    experience: '3-5 years', eligibility: 'B.E / B.Tech', salary: '₹12 - 18 LPA', mode: 'Hybrid',
    drive_date: '2026-07-21', drive_time: '9:30 AM – 1:30 PM', openings: 14,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    description: 'Capgemini is looking for Cloud DevOps Engineers with strong AWS and container orchestration experience to drive cloud-native transformations for enterprise clients.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'careers@capgemini.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c6', company_name: 'TCS', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Business Analyst', location: 'Mumbai, Maharashtra', city: 'Mumbai',
    experience: '1-3 years', eligibility: 'MBA / B.E / B.Tech', salary: '₹6 - 10 LPA', mode: 'Hybrid',
    drive_date: '2026-07-22', drive_time: '10:00 AM – 3:00 PM', openings: 25,
    skills: ['Requirements Gathering', 'JIRA', 'SQL', 'Agile', 'Stakeholder Management'],
    description: 'TCS is hiring Business Analysts for their retail banking practice. You will bridge business and technology teams, document requirements and drive sprint planning.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@tcs.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c7', company_name: 'Wipro', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'QA Automation Engineer', location: 'Hyderabad, Telangana', city: 'Hyderabad',
    experience: '1-3 years', eligibility: 'B.E / B.Tech / MCA', salary: '₹5 - 9 LPA', mode: 'Hybrid',
    drive_date: '2026-07-22', drive_time: '9:00 AM – 1:00 PM', openings: 30,
    skills: ['Selenium', 'Java', 'TestNG', 'API Testing', 'JIRA'],
    description: 'Wipro is hiring QA Automation Engineers for their telecom vertical. You will design and execute automated test suites using Selenium and Java.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'careers@wipro.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c9', company_name: 'LTIMindtree', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'React Developer', location: 'Chennai, Tamil Nadu', city: 'Chennai',
    experience: '1-3 years', eligibility: 'B.E / B.Tech / MCA', salary: '₹6 - 10 LPA', mode: 'Onsite',
    drive_date: '2026-07-23', drive_time: '9:30 AM – 2:00 PM', openings: 16,
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'REST APIs'],
    description: 'LTIMindtree is looking for React Developers to build modern web applications for their banking and financial services clients.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'careers@ltimindtree.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c3', company_name: 'HDFC Life', company_industry: 'BFSI', company_verified: true, company_logo_url: null,
    role: 'Insurance Advisor', location: 'Kolkata, West Bengal', city: 'Kolkata',
    experience: '0-1 years', eligibility: 'Any Graduate', salary: '₹2.5 - 4 LPA', mode: 'Onsite',
    drive_date: '2026-07-23', drive_time: '10:00 AM – 4:00 PM', openings: 50,
    skills: ['Communication', 'Sales', 'Customer Service'],
    description: 'HDFC Life is hiring Insurance Advisors for their Kolkata branch. Freshers with strong communication skills are welcome to apply.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@hdfclife.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c10', company_name: 'Tech Mahindra', company_industry: 'IT', company_verified: true, company_logo_url: null,
    role: 'Python Developer', location: 'Pune, Maharashtra', city: 'Pune',
    experience: '1-3 years', eligibility: 'B.E / B.Tech / MCA', salary: '₹5 - 9 LPA', mode: 'Hybrid',
    drive_date: '2026-07-24', drive_time: '9:30 AM – 1:30 PM', openings: 20,
    skills: ['Python', 'Django', 'REST APIs', 'SQL', 'Git'],
    description: 'Tech Mahindra is hiring Python Developers for their digital engineering practice. You will build backend services and REST APIs for enterprise clients.',
    status: 'approved', is_active: true, is_priority: false, contact_email: 'hr@techmahindra.com', posted_by: null, created_at: new Date().toISOString(),
  },
  {
    company_id: 'c11', company_name: 'ICICI Bank', company_industry: 'BFSI', company_verified: true, company_logo_url: null,
    role: 'Credit Analyst', location: 'Delhi, NCR', city: 'Delhi NCR',
    experience: '1-3 years', eligibility: 'MBA Finance / CA / CFA', salary: '₹6 - 10 LPA', mode: 'Onsite',
    drive_date: '2026-07-24', drive_time: '10:00 AM – 2:00 PM', openings: 15,
    skills: ['Credit Analysis', 'Financial Modelling', 'MS Excel', 'Risk Assessment'],
    description: 'ICICI Bank is hiring Credit Analysts for their SME banking division. You will evaluate loan applications, prepare credit notes and manage portfolio risk.',
    status: 'approved', is_active: true, is_priority: true, contact_email: 'hr@icicibank.com', posted_by: null, created_at: new Date().toISOString(),
  },
]

async function seed() {
  console.log(`Seeding ${drives.length} drives to Firestore...`)
  for (const drive of drives) {
    const ref = await addDoc(collection(db, 'drives'), drive)
    console.log(`✅ Added: ${drive.role} @ ${drive.company_name} → ${ref.id}`)
  }
  console.log('\nDone! All drives seeded.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
