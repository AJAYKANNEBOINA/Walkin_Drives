export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          city: string | null
          experience: string | null
          avatar_url: string | null
          resume_url: string | null
          skills: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          city?: string | null
          experience?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          city?: string | null
          experience?: string | null
          avatar_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          logo_url: string | null
          website: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          logo_url?: string | null
          website?: string | null
          verified?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          industry?: string | null
          logo_url?: string | null
          website?: string | null
          verified?: boolean
        }
        Relationships: []
      }
      drives: {
        Row: {
          id: string
          company_id: string
          role: string
          description: string | null
          location: string
          city: string
          mode: 'Onsite' | 'Hybrid' | 'Remote'
          experience: string
          eligibility: string | null
          salary: string | null
          skills: string[] | null
          openings: number | null
          drive_date: string
          drive_time: string
          is_priority: boolean
          is_active: boolean
          contact_email: string | null
          posted_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          role: string
          description?: string | null
          location: string
          city: string
          mode?: 'Onsite' | 'Hybrid' | 'Remote'
          experience: string
          eligibility?: string | null
          salary?: string | null
          skills?: string[] | null
          openings?: number | null
          drive_date: string
          drive_time: string
          is_priority?: boolean
          is_active?: boolean
          contact_email?: string | null
          posted_by?: string | null
          created_at?: string
        }
        Update: {
          role?: string
          description?: string | null
          location?: string
          city?: string
          mode?: 'Onsite' | 'Hybrid' | 'Remote'
          experience?: string
          eligibility?: string | null
          salary?: string | null
          skills?: string[] | null
          openings?: number | null
          drive_date?: string
          drive_time?: string
          is_priority?: boolean
          is_active?: boolean
          contact_email?: string | null
        }
        Relationships: [{ foreignKeyName: 'drives_company_id_fkey'; columns: ['company_id']; referencedRelation: 'companies'; referencedColumns: ['id'] }]
      }
      applications: {
        Row: {
          id: string
          drive_id: string
          user_id: string
          status: 'applied' | 'shortlisted' | 'selected' | 'rejected'
          applied_at: string
        }
        Insert: {
          id?: string
          drive_id: string
          user_id: string
          status?: 'applied' | 'shortlisted' | 'selected' | 'rejected'
          applied_at?: string
        }
        Update: {
          status?: 'applied' | 'shortlisted' | 'selected' | 'rejected'
        }
        Relationships: [
          { foreignKeyName: 'applications_drive_id_fkey'; columns: ['drive_id']; referencedRelation: 'drives'; referencedColumns: ['id'] },
          { foreignKeyName: 'applications_user_id_fkey'; columns: ['user_id']; referencedRelation: 'users'; referencedColumns: ['id'] }
        ]
      }
      job_alerts: {
        Row: {
          id: string
          user_id: string
          city: string | null
          experience: string | null
          roles: string[] | null
          via_email: boolean
          via_whatsapp: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city?: string | null
          experience?: string | null
          roles?: string[] | null
          via_email?: boolean
          via_whatsapp?: boolean
          created_at?: string
        }
        Update: {
          city?: string | null
          experience?: string | null
          roles?: string[] | null
          via_email?: boolean
          via_whatsapp?: boolean
        }
        Relationships: []
      }
    }
  }
}

// Convenience row types
export type DbProfile     = Database['public']['Tables']['profiles']['Row']
export type DbCompany     = Database['public']['Tables']['companies']['Row']
export type DbDrive       = Database['public']['Tables']['drives']['Row']
export type DbApplication = Database['public']['Tables']['applications']['Row']
export type DbJobAlert    = Database['public']['Tables']['job_alerts']['Row']

// Drive row joined with its company
export type DriveWithCompany     = DbDrive       & { company: DbCompany }
export type ApplicationWithDrive = DbApplication & { drive: DriveWithCompany }
