export type EducationLevel = 'HBO' | 'WO' | 'MBO' | 'Master HBO' | 'Master WO';

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

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Nhien',
    email: 'nhien@student.nl',
    password: '123456',
    major: 'ICT',
    education_level: 'HBO',
    strengths: ['Java Programming', 'GitLab CI/CD', 'English', 'Dutch', 'Photoshop'],
    needs_help_with: ['C# Programming', 'Python Programming'],
    description: 'I can help with Java and CI/CD. Looking to improve Python. I can help with Java and CI/CD. Looking to improve Python. I can help with Java and CI/CD. Looking to improve Pythodadsadasdn.',
    token_balance: 3,
    created_at: '2026-02-01T10:00:00Z',
    profile_image_url: 'https://res.cloudinary.com/jerrick/image/upload/v1530566517/finbpjpirbespgfpul19.jpg',
  },
  {
    id: '2',
    name: 'Quynh',
    email: 'quynh@student.nl',
    password: '123456',
    major: 'ICT',
    education_level: 'HBO',
    strengths: ['Java Programming', 'Embedded Programming', 'Accounting'],
    needs_help_with: ['Dutch', 'Spanish'],
    description: 'Embedded + Java. Learning languages.',
    token_balance: 2,
    created_at: '2026-02-03T12:30:00Z',
    profile_image_url: 'https://res.cloudinary.com/jerrick/image/upload/v1530566517/finbpjpirbespgfpul19.jpg',
  },
  {
    id: '3',
    name: 'Jan',
    email: 'jan@student.nl',
    password: '123456',
    major: 'ICT',
    education_level: 'HBO',
    strengths: ['Java Programming', 'C# Programming', 'GitLab CI/CD'],
    needs_help_with: ['Advanced Mathematics', 'Embedded Programming'],
    description: 'Happy to help with C#.',
    token_balance: 1,
    created_at: '2026-02-05T09:15:00Z',
    profile_image_url: 'https://res.cloudinary.com/jerrick/image/upload/v1530566517/finbpjpirbespgfpul19.jpg',
  },
  {
    id: '4',
    name: 'User D',
    email: 'userd@student.nl',
    password: '123456',
    major: 'ICT',
    education_level: 'HBO',
    strengths: ['Geography', 'History', 'English', 'Dutch', 'Spanish', 'French', 'French', 'French', 'French', 'French', 'French', 'French', 'French', 'French'],
    needs_help_with: ['Python Programming', 'Advanced Mathematics'],
    description: 'Languages + humanities.',
    token_balance: 4,
    created_at: '2026-02-06T18:00:00Z',
    profile_image_url: 'https://res.cloudinary.com/jerrick/image/upload/v1530566517/finbpjpirbespgfpul19.jpg',
  },
  {
    id: '5',
    name: 'User E',
    email: 'usere@student.nl',
    password: '123456',
    major: 'Accounting',
    education_level: 'HBO',
    strengths: ['Finance', 'English', 'Advanced Mathematics', 'Accounting'],
    needs_help_with: ['Matlab', 'Dutch'],
    description: 'Finance/accounting.',
    token_balance: 3,
    created_at: '2026-02-07T14:00:00Z',
    profile_image_url: 'https://res.cloudinary.com/jerrick/image/upload/v1530566517/finbpjpirbespgfpul19.jpg',
  },
];