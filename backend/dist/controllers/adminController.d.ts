import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
export declare const getUsers: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createTemplate: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateTemplate: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteTemplate: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getStatistics: (_req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=adminController.d.ts.map