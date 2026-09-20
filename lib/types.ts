// StatSamarth AI Core Type Definitions

export type CompetencyCategory = 'Domain' | 'Behavioral' | 'Technical';
export type BloomsTaxonomyLevel = 'Remember' | 'Apply' | 'Analyze';
export type ZoneRegion = 'North Zone - New Delhi' | 'East Zone - Kolkata' | 'South Zone - Bengaluru' | 'West Zone - Mumbai' | 'Central Zone - Bhopal';

export interface User {
  id: string;
  name: string;
  email: string;
  role_title: string;
  zone: ZoneRegion;
  apar_id: string;
  created_at: string;
  avatar?: string;
  department?: string;
}

export interface FracCompetency {
  id: string;
  competency_name: string;
  category: CompetencyCategory;
  required_level: number; // 1 to 5
  description: string;
  code?: string;
}

export interface UserCompetencyScore {
  id: string;
  user_id: string;
  competency_id: string;
  current_level: number; // 1 to 5
  last_assessed_at: string;
  competency?: FracCompetency;
}

export interface IGotCourse {
  id: string;
  course_title: string;
  provider: string;
  competency_id: string;
  target_level: number;
  igot_course_id: string;
  duration_mins: number;
  rating: number;
  thumbnail?: string;
  tags?: string[];
  semantic_match_score?: number; // Calculated dynamically
}

export interface LearningMaterial {
  id: string;
  title: string;
  uploaded_by: string;
  file_path: string;
  vector_namespace: string;
  created_at: string;
  file_size?: string;
  page_count?: number;
  category?: string;
  summary?: string;
}

export interface MCQOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correct_key: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  source_citation: {
    manual_title: string;
    section: string;
    page_or_para: string;
    exact_quote?: string;
  };
  blooms_level: BloomsTaxonomyLevel;
  competency_id?: string;
}

export interface Quiz {
  id: string;
  material_id: string;
  title: string;
  questions_json: MCQQuestion[];
  blooms_level: BloomsTaxonomyLevel;
  time_limit_mins?: number;
  pass_percentage?: number;
  created_at?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number; // percentage
  passed: boolean;
  competency_delta: number;
  timestamp: string;
  answers_breakdown?: {
    question_id: string;
    selected_key: string;
    is_correct: boolean;
  }[];
}

export interface CompetencyGapItem {
  competency_id: string;
  competency_name: string;
  category: CompetencyCategory;
  required_level: number;
  current_level: number;
  gap: number; // required_level - current_level
  status: 'VERIFIED' | 'GAP_IDENTIFIED';
  readiness_percentage: number;
  recommended_course?: IGotCourse;
}

export interface UserCompetencyProfileResponse {
  user: User;
  readiness_index: number;
  total_competencies: number;
  verified_competencies: number;
  gap_count: number;
  radar_data: {
    competency: string;
    current: number;
    required: number;
    category: CompetencyCategory;
    fullMark: number;
  }[];
  gaps: CompetencyGapItem[];
  recent_attempts: QuizAttempt[];
  apar_status: {
    synced: boolean;
    last_sync: string | null;
    apar_id: string;
    pending_updates: number;
  };
}

export interface ZonalCapacityData {
  zone: string;
  headquarters: string;
  officers_count: number;
  avg_readiness_index: number;
  domain_gap_avg: number;
  tech_gap_avg: number;
  behavioral_gap_avg: number;
  top_gap_competency: string;
  apar_sync_rate: number;
}
