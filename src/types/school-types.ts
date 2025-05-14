export type Role = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: Role;
  school_id: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  address: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  grade_level: number;
  created_at: string;
}

export interface ClassMembership {
  id: string;
  class_id: string;
  user_id: string;
  role: Role;
  created_at: string;
}

export interface OnboardingSurvey {
  id: string;
  student_id: string;
  grade_level: number;
  baseline_wellbeing_score: number;
  existing_conditions: string | null;
  preferred_coping_mechanisms: string[] | null;
  completed: boolean;
  created_at: string;
  
  // Additional fields
  student_name?: string; // Used only for form, not stored in DB
  gender?: string;
  class_section?: string;
  mood_today?: number;
  sleep_hours?: number;
  stress_level?: number;
  social_support_level?: number;
  physical_activity_level?: string;
  screen_time_hours?: number;
  
  // Add the missing fields that were causing errors
  age?: number;
  school_name?: string;
  diet_quality?: string;
  academic_pressure?: number;
}

export interface WellbeingMetric {
  id: string;
  student_id: string;
  wellbeing_score: number | null;
  sentiment_score: number | null;
  stress_level: number | null;
  interaction_count: number;
  measured_at: string;
}

export type ConcernLevel = 'mild' | 'moderate' | 'critical';

export interface ConcernFlag {
  id: string;
  student_id: string;
  concern_level: ConcernLevel;
  reason: string;
  resolved: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConcernAction {
  id: string;
  concern_id: string;
  admin_id: string;
  action_type: string;
  notes: string | null;
  scheduled_for: string | null;
  created_at: string;
}

export interface StudentWellbeingSummary {
  student_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  average_wellbeing: number;
  trend: 'improving' | 'declining' | 'stable';
  flags: ConcernFlag[];
  last_interaction: string;
}

export interface ClassWellbeingSummary {
  class_id: string;
  class_name: string;
  grade_level: number;
  average_wellbeing: number;
  students_count: number;
  flagged_students_count: number;
}

export interface AdminSurvey {
  id: string;
  admin_id: string;
  school_id: string | null;
  school_name: string;
  position: string | null;
  created_at: string;
}
