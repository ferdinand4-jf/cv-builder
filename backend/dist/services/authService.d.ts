export interface AuthResult {
    user: any;
    token: string;
    refreshToken: string;
}
export declare const registerUser: (email: string, password: string, firstName: string, lastName: string) => Promise<AuthResult>;
export declare const loginUser: (email: string, password: string) => Promise<AuthResult>;
export declare const logoutUser: (refreshToken: string) => Promise<void>;
export declare const refreshAccessToken: (refreshToken: string) => Promise<{
    token: string;
    refreshToken: string;
}>;
//# sourceMappingURL=authService.d.ts.map