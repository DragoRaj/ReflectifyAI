
export type Role = "student" | "teacher" | "admin";

export type ConcernLevel = "mild" | "moderate" | "critical";

export interface School {
  id: string;
  name: string;
  address?: string;
}

export interface Profile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: Role;
  school_id?: string;
}

export interface ConcernFlag {
  id: string;
  student_id: string;
  concern_level: ConcernLevel;
  reason: string;
  notes?: string;
  resolved: boolean;
  created_at: string;
}

export interface WellbeingMetric {
  id: string;
  student_id: string;
  wellbeing_score: number;
  stress_level?: number;
  measured_at: string;
}

export interface OnboardingSurvey {
  id: string;
  student_id: string;
  grade_level: number;
  baseline_wellbeing_score: number;
  existing_conditions?: string;
  preferred_coping_mechanisms: string[];
  created_at: string;
}

export interface TeacherSurvey {
  id: string;
  teacher_id: string;
  school_id: string;
  school_name: string;
  grade_level: number;
  class_section: string;
  observed_student_stress: number;
  class_atmosphere: string;
  common_challenges: string[];
  support_resources_needed: string;
  intervention_suggestions?: string;
}

export interface AdminSurvey {
  id: string;
  admin_id: string;
  school_id: string;
  school_name: string;
  position: string;
}

export interface Class {
  id: string;
  name: string;
  grade_level: number;
  school_id: string;
}

export interface ClassMembership {
  id: string;
  user_id: string;
  class_id: string;
  role: Role;
}

export interface StudentWellbeingSummary {
  student_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  average_wellbeing: number;
  trend: 'improving' | 'declining' | 'stable';
  flags: ConcernFlag[];
  last_interaction: string | null;
}

export interface ClassWellbeingSummary {
  class_id: string;
  class_name: string;
  grade_level: number;
  students_count: number;
  average_wellbeing: number;
  flagged_students_count: number;
}

export interface TeacherInsight {
  id: string;
  teacher_id: string;
  student_id: string;
  class_id: string;
  wellbeing_summary: string;
  trend_description: string;
  recommendations: string;
}
