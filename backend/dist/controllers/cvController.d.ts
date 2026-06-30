import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const createCV: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCVs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCV: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCV: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteCV: (req: AuthRequest, res: Response) => Promise<void>;
export declare const generateCVPDF: (req: AuthRequest, res: Response) => Promise<void>;
export declare const duplicateCV: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=cvController.d.ts.map