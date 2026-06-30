import { CV as PrismaCV } from '@prisma/client';
export interface CV extends PrismaCV {
    template?: any;
    user?: any;
}
export interface CVCreateInput {
    userId: string;
    templateId: string;
    title: string;
    personalInfo: any;
    experience: any[];
    education: any[];
    skills: any[];
    languages: any[];
    certifications: any[];
    projects: any[];
    customSections: any[];
    styling: any;
    isPublic?: boolean;
}
export interface CVUpdateInput {
    title?: string;
    templateId?: string;
    personalInfo?: any;
    experience?: any[];
    education?: any[];
    skills?: any[];
    languages?: any[];
    certifications?: any[];
    projects?: any[];
    customSections?: any[];
    styling?: any;
    isPublic?: boolean;
}
export interface CVResponse extends Omit<PrismaCV, 'userId'> {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    template?: {
        id: string;
        name: string;
        category: string;
        styles: any;
    };
}
//# sourceMappingURL=CV.d.ts.map