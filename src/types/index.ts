export type WorkMode = 'Hybrid' | 'Onsite' | 'Remote';

export type DriveStatus = 'active' | 'expired' | 'upcoming';

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  verified: boolean;
  industry?: string;
}

export interface Drive {
  id: string;
  company: Company;
  role: string;
  location: string;
  city: string;
  experience: string;
  eligibility: string;
  salary?: string;
  mode: WorkMode;
  drive_date: string;
  drive_time: string;
  is_priority: boolean;
  is_active: boolean;
  created_at: string;
  description?: string;
  skills?: string[];
  openings?: number;
  posted_days_ago: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  resume_url?: string;
  experience?: string;
  skills?: string[];
  avatar_url?: string;
}

export interface Application {
  id: string;
  drive: Drive;
  user_id: string;
  status: 'applied' | 'shortlisted' | 'selected' | 'rejected';
  applied_at: string;
}

export interface FilterState {
  query: string;
  cities: string[];
  experience: string;
  mode: string;
  salary: string;
  category: string;
  sort: string;
  dateRange: string;
}
