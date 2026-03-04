export type EducationLevel =
  | 'HBO'
  | 'WO'
  | 'MBO'
  | 'Master HBO'
  | 'Master WO';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  major: string;
  education_level: EducationLevel;
  strengths: string[];
  needs_help_with: string[];
  description?: string;
  token_balance: number;
  created_at: string;
  profile_image_url?: string;
};