import { z } from 'zod'

// Schéma pour les informations personnelles
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  summary: z.string().optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
})

// Schéma pour l'expérience
export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
})

// Schéma pour l'éducation
export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
})

// Schéma pour les compétences
export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
})

// Schéma principal pour le CV
export const cvSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  templateId: z.string().min(1, 'Template is required'),
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  languages: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Language name is required'),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native', 'Fluent']),
  })).default([]),
  certifications: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Certification name is required'),
    issuer: z.string().min(1, 'Issuer is required'),
    date: z.string().min(1, 'Date is required'),
  })).default([]),
  projects: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    link: z.string().url('Invalid URL').optional().or(z.literal('')),
  })).default([]),
  customSections: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Section title is required'),
    content: z.string().min(1, 'Section content is required'),
  })).default([]),
  styling: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().optional(),
  }).optional(),
  isPublic: z.boolean().default(false),
})

export type CVFormData = z.infer<typeof cvSchema>