export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_surveys: {
        Row: {
          admin_id: string
          created_at: string
          id: string
          position: string | null
          school_id: string | null
          school_name: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: string
          position?: string | null
          school_id?: string | null
          school_name: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: string
          position?: string | null
          school_id?: string | null
          school_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_surveys_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_interactions: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          mood: string | null
          user_id: string
          user_message: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          mood?: string | null
          user_id: string
          user_message: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          mood?: string | null
          user_id?: string
          user_message?: string
        }
        Relationships: []
      }
      class_memberships: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_memberships_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          grade_level: number
          id: string
          name: string
          school_id: string
        }
        Insert: {
          created_at?: string | null
          grade_level: number
          id?: string
          name: string
          school_id: string
        }
        Update: {
          created_at?: string | null
          grade_level?: number
          id?: string
          name?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      concern_actions: {
        Row: {
          action_type: string
          admin_id: string
          concern_id: string
          created_at: string | null
          id: string
          notes: string | null
          scheduled_for: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          concern_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_for?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          concern_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          scheduled_for?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concern_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concern_actions_concern_id_fkey"
            columns: ["concern_id"]
            isOneToOne: false
            referencedRelation: "concern_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      concern_flags: {
        Row: {
          concern_level: Database["public"]["Enums"]["concern_level"]
          created_at: string | null
          id: string
          notes: string | null
          reason: string
          resolved: boolean | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          concern_level: Database["public"]["Enums"]["concern_level"]
          created_at?: string | null
          id?: string
          notes?: string | null
          reason: string
          resolved?: boolean | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          concern_level?: Database["public"]["Enums"]["concern_level"]
          created_at?: string | null
          id?: string
          notes?: string | null
          reason?: string
          resolved?: boolean | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concern_flags_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          mood: number
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mood: number
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mood?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      mindfulness_sessions: {
        Row: {
          completed: boolean
          created_at: string
          duration_seconds: number
          id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          duration_seconds: number
          id?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          duration_seconds?: number
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_surveys: {
        Row: {
          baseline_wellbeing_score: number
          completed: boolean | null
          created_at: string | null
          existing_conditions: string | null
          grade_level: number
          id: string
          preferred_coping_mechanisms: string[] | null
          student_id: string
        }
        Insert: {
          baseline_wellbeing_score: number
          completed?: boolean | null
          created_at?: string | null
          existing_conditions?: string | null
          grade_level: number
          id?: string
          preferred_coping_mechanisms?: string[] | null
          student_id: string
        }
        Update: {
          baseline_wellbeing_score?: number
          completed?: boolean | null
          created_at?: string | null
          existing_conditions?: string | null
          grade_level?: number
          id?: string
          preferred_coping_mechanisms?: string[] | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_surveys_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      teacher_insights: {
        Row: {
          class_id: string
          created_at: string
          id: string
          recommendations: string
          student_id: string
          teacher_id: string
          trend_description: string
          updated_at: string
          wellbeing_summary: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          recommendations: string
          student_id: string
          teacher_id: string
          trend_description: string
          updated_at?: string
          wellbeing_summary: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          recommendations?: string
          student_id?: string
          teacher_id?: string
          trend_description?: string
          updated_at?: string
          wellbeing_summary?: string
        }
        Relationships: []
      }
      teacher_surveys: {
        Row: {
          class_atmosphere: string
          class_section: string
          common_challenges: string[]
          created_at: string
          grade_level: number
          id: string
          intervention_suggestions: string | null
          observed_student_stress: number
          school_id: string | null
          school_name: string
          support_resources_needed: string
          teacher_id: string
        }
        Insert: {
          class_atmosphere: string
          class_section: string
          common_challenges: string[]
          created_at?: string
          grade_level: number
          id?: string
          intervention_suggestions?: string | null
          observed_student_stress: number
          school_id?: string | null
          school_name: string
          support_resources_needed: string
          teacher_id: string
        }
        Update: {
          class_atmosphere?: string
          class_section?: string
          common_challenges?: string[]
          created_at?: string
          grade_level?: number
          id?: string
          intervention_suggestions?: string | null
          observed_student_stress?: number
          school_id?: string | null
          school_name?: string
          support_resources_needed?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_surveys_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      wellbeing_metrics: {
        Row: {
          id: string
          interaction_count: number | null
          measured_at: string | null
          sentiment_score: number | null
          stress_level: number | null
          student_id: string
          wellbeing_score: number | null
        }
        Insert: {
          id?: string
          interaction_count?: number | null
          measured_at?: string | null
          sentiment_score?: number | null
          stress_level?: number | null
          student_id: string
          wellbeing_score?: number | null
        }
        Update: {
          id?: string
          interaction_count?: number | null
          measured_at?: string | null
          sentiment_score?: number | null
          stress_level?: number | null
          student_id?: string
          wellbeing_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wellbeing_metrics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      concern_level: "mild" | "moderate" | "critical"
      user_role: "student" | "teacher" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      concern_level: ["mild", "moderate", "critical"],
      user_role: ["student", "teacher", "admin"],
    },
  },
} as const
