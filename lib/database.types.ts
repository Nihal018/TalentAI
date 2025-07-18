export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          id: string
          job_id: string
          resume_id: string
          score: number | null
          status: "pending" | "qualified" | "contacted"
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          resume_id: string
          score?: number | null
          status?: "pending" | "qualified" | "contacted"
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          resume_id?: string
          score?: number | null
          status?: "pending" | "qualified" | "contacted"
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          benefits: string[] | null
          company: string
          company_logo: string | null
          description: string
          embedding: number[]
          employer_id: string
          experience: string | null
          id: string
          location: string | null
          posted_date: string
          remote: boolean | null
          requirements: string[] | null
          salary: string | null
          skills: string[] | null
          status: "active" | "closed"
          title: string
          type: string | null
        }
        Insert: {
          benefits?: string[] | null
          company: string
          company_logo?: string | null
          description: string
          embedding?: number[]
          employer_id: string
          experience?: string | null
          id?: string
          location?: string | null
          posted_date?: string
          remote?: boolean | null
          requirements?: string[] | null
          salary?: string | null
          skills?: string[] | null
          status?: "active" | "closed"
          title: string
          type?: string | null
        }
        Update: {
          benefits?: string[] | null
          company?: string
          company_logo?: string | null
          description?: string
          embedding?: number[]
          employer_id?: string
          experience?: string | null
          id?: string
          location?: string | null
          posted_date?: string
          remote?: boolean | null
          requirements?: string[] | null
          salary?: string | null
          skills?: string[] | null
          status?: "active" | "closed"
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          created_at: string
          embedding: number[]
          id: string
          json: Json | null
          raw_url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          embedding?: number[]
          id?: string
          json?: Json | null
          raw_url: string
          user_id: string
        }
        Update: {
          created_at?: string
          embedding?: number[]
          id?: string
          json?: Json | null
          raw_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          profile_data: Json | null
          role: "job_seeker" | "employer" | "admin"
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          profile_data?: Json | null
          role: "job_seeker" | "employer" | "admin"
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          profile_data?: Json | null
          role?: "job_seeker" | "employer" | "admin"
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// Type aliases for easier use
export type Users = Tables<"users">
export type Jobs = Tables<"jobs">
export type Applications = Tables<"applications">
export type Resumes = Tables<"resumes">

export type JobStatus = "active" | "closed"
export type ApplicationStatus = "pending" | "qualified" | "contacted"
export type UserRole = "job_seeker" | "employer" | "admin"
