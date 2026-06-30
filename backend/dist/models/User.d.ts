import { User as PrismaUser, Role } from '@prisma/client';
export interface User extends Omit<PrismaUser, 'password'> {
    password?: string;
}
export interface UserCreateInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
}
export interface UserUpdateInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: Role;
    isActive?: boolean;
}
export interface UserResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const toUserResponse: (user: PrismaUser) => UserResponse;
//# sourceMappingURL=User.d.ts.map