export declare const generateToken: (userId: string, email: string, role: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyToken: (token: string) => any;
export declare const verifyRefreshToken: (token: string) => any;
export declare const decodeToken: (token: string) => any;
//# sourceMappingURL=jwt.d.ts.map