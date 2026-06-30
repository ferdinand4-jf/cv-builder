export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'MODERN' | 'CLASSIC' | 'ATS_FRIENDLY' | 'CREATIVE';
  thumbnail: string;
  styles: TemplateStyles;
  isActive: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateStyles {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  spacing: 'compact' | 'normal' | 'relaxed';
  sections: string[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Project {
  name: string;
  description: string;
  link?: string;
}

export interface CVStyling {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
}

export interface CV {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  customSections: any[];
  styling: CVStyling;
  isPublic: boolean;
  template?: Template;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Statistics {
  totalUsers: number;
  totalCVs: number;
  totalTemplates: number;
  activeUsers: number;
  premiumUsers: number;
  cvsByTemplate: {
    templateId: string;
    templateName: string;
    count: number;
  }[];
  usersByMonth: {
    month: string;
    count: number;
  }[];
  cvsByMonth: {
    month: string;
    count: number;
  }[];
}