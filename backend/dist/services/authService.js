"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const server_1 = require("../server");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const registerUser = async (email, password, firstName, lastName) => {
    // Check if user exists
    const existingUser = await server_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('User already exists');
    }
    // Hash password
    const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
    // Create user
    const user = await server_1.prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
        },
    });
    // Generate tokens
    const token = (0, jwt_1.generateToken)(user.id, user.email, user.role);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    // Save refresh token
    await server_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        user: (0, User_1.toUserResponse)(user),
        token,
        refreshToken,
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await server_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    if (!user.isActive) {
        throw new Error('Account is deactivated');
    }
    const isValidPassword = await (0, bcrypt_1.comparePassword)(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }
    // Update last login
    await server_1.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
    });
    // Generate tokens
    const token = (0, jwt_1.generateToken)(user.id, user.email, user.role);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    // Save refresh token
    await server_1.prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        user: (0, User_1.toUserResponse)(user),
        token,
        refreshToken,
    };
};
exports.loginUser = loginUser;
const logoutUser = async (refreshToken) => {
    await server_1.prisma.refreshToken.delete({
        where: { token: refreshToken },
    });
};
exports.logoutUser = logoutUser;
const refreshAccessToken = async (refreshToken) => {
    const storedToken = await server_1.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
    });
    if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
    }
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!decoded) {
        throw new Error('Invalid refresh token');
    }
    const user = await server_1.prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
    }
    // Generate new tokens
    const newToken = (0, jwt_1.generateToken)(user.id, user.email, user.role);
    const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    // Update refresh token
    await server_1.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    return {
        token: newToken,
        refreshToken: newRefreshToken,
    };
};
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=authService.js.map