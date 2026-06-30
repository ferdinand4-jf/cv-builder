import { Template as PrismaTemplate, TemplateCategory } from '@prisma/client';
export interface Template extends PrismaTemplate {
}
export interface TemplateCreateInput {
    name: string;
    description: string;
    category: TemplateCategory;
    thumbnail: string;
    styles: any;
    isActive?: boolean;
    isPremium?: boolean;
}
export interface TemplateUpdateInput {
    name?: string;
    description?: string;
    category?: TemplateCategory;
    thumbnail?: string;
    styles?: any;
    isActive?: boolean;
    isPremium?: boolean;
}
export interface TemplateResponse {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    thumbnail: string;
    styles: any;
    isActive: boolean;
    isPremium: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Template.d.ts.map