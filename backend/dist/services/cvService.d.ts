import { CV, CVCreateInput, CVUpdateInput } from '../models/CV';
export declare const createCV: (userId: string, data: CVCreateInput) => Promise<CV>;
export declare const getCVs: (userId: string) => Promise<CV[]>;
export declare const getCV: (id: string, userId: string) => Promise<CV>;
export declare const updateCV: (id: string, userId: string, data: CVUpdateInput) => Promise<CV>;
export declare const deleteCV: (id: string, userId: string) => Promise<void>;
export declare const duplicateCV: (id: string, userId: string) => Promise<CV>;
//# sourceMappingURL=cvService.d.ts.map