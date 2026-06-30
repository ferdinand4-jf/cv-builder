"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const server_1 = require("../../src/server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const uuid_1 = require("uuid");
const User_1 = require("../models/User");
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // Check if user exists
        const existingUser = await server_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await server_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName
            }
        });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Generate refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        // Save refresh token
        await server_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            user: userWithoutPassword,
            token,
            refreshToken
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await server_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        if (!user.isActive) {
            res.status(401).json({ message: 'Account is deactivated' });
            return;
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Update last login
        await server_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Generate refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        // Save refresh token
        await server_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            token,
            refreshToken
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token required' });
            return;
        }
        const storedToken = await server_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            res.status(401).json({ message: 'Invalid or expired refresh token' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await server_1.prisma.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user || !user.isActive) {
            res.status(401).json({ message: 'User not found' });
            return;
        }
        // Generate new tokens
        const newToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        // Update refresh token
        await server_1.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await server_1.prisma.refreshToken.delete({
                where: { token: refreshToken }
            });
        }
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await server_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Generate reset token
        const resetToken = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        // Save reset token
        await server_1.prisma.passwordReset.create({
            data: {
                token: resetToken,
                userId: user.id,
                expiresAt
            }
        });
        // Send reset email
        await (0, emailService_1.sendPasswordResetEmail)(user.email, resetToken);
        res.json({ message: 'Password reset email sent' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to send reset email' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const resetRecord = await server_1.prisma.passwordReset.findUnique({
            where: { token },
            include: { user: true }
        });
        if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
            res.status(400).json({ message: 'Invalid or expired reset token' });
            return;
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        // Update user password
        await server_1.prisma.user.update({
            where: { id: resetRecord.userId },
            data: { password: hashedPassword }
        });
        // Mark reset token as used
        await server_1.prisma.passwordReset.update({
            where: { id: resetRecord.id },
            data: { used: true }
        });
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};
exports.resetPassword = resetPassword;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const user = await server_1.prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userResponse = (0, User_1.toUserResponse)(user);
        res.json(userResponse);
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Failed to get user info' });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map