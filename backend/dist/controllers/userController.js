"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.updateProfile = void 0;
const server_1 = require("../server");
const User_1 = require("../models/User");
const bcrypt_1 = require("../utils/bcrypt");
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { firstName, lastName, email } = req.body;
        // Check if email is already taken by another user
        if (email) {
            const existingUser = await server_1.prisma.user.findFirst({
                where: {
                    email,
                    id: { not: req.user.id },
                },
            });
            if (existingUser) {
                res.status(400).json({ message: 'Email already taken' });
                return;
            }
        }
        const updatedUser = await server_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                email: email || undefined,
            },
        });
        const userResponse = (0, User_1.toUserResponse)(updatedUser);
        res.json(userResponse);
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        const user = await server_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Verify current password
        const isValid = await (0, bcrypt_1.comparePassword)(currentPassword, user.password);
        if (!isValid) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }
        // Hash new password
        const hashedPassword = await (0, bcrypt_1.hashPassword)(newPassword);
        await server_1.prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
};
exports.changePassword = changePassword;
const deleteAccount = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { password } = req.body;
        const user = await server_1.prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Verify password
        const isValid = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isValid) {
            res.status(401).json({ message: 'Password is incorrect' });
            return;
        }
        // Delete user (cascade will delete related data)
        await server_1.prisma.user.delete({
            where: { id: req.user.id },
        });
        res.json({ message: 'Account deleted successfully' });
    }
    catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=userController.js.map