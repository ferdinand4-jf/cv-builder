"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatistics = exports.deleteTemplate = exports.updateTemplate = exports.createTemplate = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const server_1 = require("../../src/server");
const User_1 = require("../models/User");
const bcrypt_1 = require("../utils/bcrypt");
// User Management
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await Promise.all([
            server_1.prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            server_1.prisma.user.count({ where }),
        ]);
        const userResponses = users.map(User_1.toUserResponse);
        res.json({
            data: userResponses,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Failed to get users' });
    }
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await server_1.prisma.user.findUnique({
            where: { id },
            include: {
                cvs: {
                    include: {
                        template: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userResponse = (0, User_1.toUserResponse)(user);
        res.json({ ...userResponse, cvs: user.cvs });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Failed to get user' });
    }
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, role, isActive, password } = req.body;
        const user = await server_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if email is already taken by another user
        if (email) {
            const existingUser = await server_1.prisma.user.findFirst({
                where: {
                    email,
                    id: { not: id },
                },
            });
            if (existingUser) {
                res.status(400).json({ message: 'Email already taken' });
                return;
            }
        }
        const updateData = {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            email: email || undefined,
            role: role || undefined,
            isActive: isActive !== undefined ? isActive : undefined,
        };
        if (password) {
            updateData.password = await (0, bcrypt_1.hashPassword)(password);
        }
        const updatedUser = await server_1.prisma.user.update({
            where: { id },
            data: updateData,
        });
        const userResponse = (0, User_1.toUserResponse)(updatedUser);
        res.json(userResponse);
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent admin from deleting themselves
        if (!req.user || id === req.user.id) {
            res.status(400).json({ message: 'Cannot delete your own account' });
            return;
        }
        const user = await server_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        await server_1.prisma.user.delete({
            where: { id },
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
// Template Management
const createTemplate = async (req, res) => {
    try {
        const { name, description, category, thumbnail, styles, isActive, isPremium } = req.body;
        const existingTemplate = await server_1.prisma.template.findUnique({
            where: { name },
        });
        if (existingTemplate) {
            res.status(400).json({ message: 'Template with this name already exists' });
            return;
        }
        const template = await server_1.prisma.template.create({
            data: {
                name,
                description,
                category,
                thumbnail,
                styles,
                isActive: isActive !== undefined ? isActive : true,
                isPremium: isPremium !== undefined ? isPremium : false,
            },
        });
        res.status(201).json(template);
    }
    catch (error) {
        console.error('Create template error:', error);
        res.status(500).json({ message: 'Failed to create template' });
    }
};
exports.createTemplate = createTemplate;
const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, thumbnail, styles, isActive, isPremium } = req.body;
        const template = await server_1.prisma.template.findUnique({
            where: { id },
        });
        if (!template) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        // Check if name is already taken by another template
        if (name && name !== template.name) {
            const existingTemplate = await server_1.prisma.template.findUnique({
                where: { name },
            });
            if (existingTemplate) {
                res.status(400).json({ message: 'Template with this name already exists' });
                return;
            }
        }
        const updatedTemplate = await server_1.prisma.template.update({
            where: { id },
            data: {
                name: name || undefined,
                description: description || undefined,
                category: category || undefined,
                thumbnail: thumbnail || undefined,
                styles: styles || undefined,
                isActive: isActive !== undefined ? isActive : undefined,
                isPremium: isPremium !== undefined ? isPremium : undefined,
            },
        });
        res.json(updatedTemplate);
    }
    catch (error) {
        console.error('Update template error:', error);
        res.status(500).json({ message: 'Failed to update template' });
    }
};
exports.updateTemplate = updateTemplate;
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await server_1.prisma.template.findUnique({
            where: { id },
        });
        if (!template) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        await server_1.prisma.template.delete({
            where: { id },
        });
        res.json({ message: 'Template deleted successfully' });
    }
    catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ message: 'Failed to delete template' });
    }
};
exports.deleteTemplate = deleteTemplate;
// Statistics
const getStatistics = async (_req, res) => {
    try {
        const [totalUsers, activeUsers, totalCVs, totalTemplates, cvsByTemplate, usersByMonth, cvsByMonth,] = await Promise.all([
            server_1.prisma.user.count(),
            server_1.prisma.user.count({ where: { isActive: true } }),
            server_1.prisma.cV.count(),
            server_1.prisma.template.count(),
            server_1.prisma.cV.groupBy({
                by: ['templateId'],
                _count: true,
                orderBy: {
                    _count: {
                        templateId: 'desc',
                    },
                },
            }),
            server_1.prisma.$queryRaw `
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
          COUNT(*) as count
        FROM "User"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt") ASC
      `,
            server_1.prisma.$queryRaw `
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
          COUNT(*) as count
        FROM "CV"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY DATE_TRUNC('month', "createdAt") ASC
      `,
        ]);
        // Get template names for cvsByTemplate
        const templateIds = cvsByTemplate.map((item) => item.templateId);
        const templates = await server_1.prisma.template.findMany({
            where: {
                id: { in: templateIds },
            },
            select: {
                id: true,
                name: true,
            },
        });
        const templateMap = new Map(templates.map((t) => [t.id, t.name]));
        const cvsByTemplateWithNames = cvsByTemplate.map((item) => ({
            templateId: item.templateId,
            templateName: templateMap.get(item.templateId) || 'Unknown',
            count: item._count,
        }));
        res.json({
            totalUsers,
            activeUsers,
            totalCVs,
            totalTemplates,
            cvsByTemplate: cvsByTemplateWithNames,
            usersByMonth: usersByMonth,
            cvsByMonth: cvsByMonth,
        });
    }
    catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ message: 'Failed to get statistics' });
    }
};
exports.getStatistics = getStatistics;
//# sourceMappingURL=adminController.js.map