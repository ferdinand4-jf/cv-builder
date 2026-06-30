"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateByCategory = exports.getTemplate = exports.getTemplates = void 0;
const server_1 = require("../server");
const getTemplates = async (req, res) => {
    try {
        const { includeInactive } = req.query;
        const where = {
            isActive: includeInactive === 'true' ? undefined : true,
        };
        const templates = await server_1.prisma.template.findMany({
            where,
            orderBy: {
                name: 'asc',
            },
        });
        res.json(templates);
    }
    catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ message: 'Failed to get templates' });
    }
};
exports.getTemplates = getTemplates;
const getTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await server_1.prisma.template.findUnique({
            where: { id },
        });
        if (!template) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        res.json(template);
    }
    catch (error) {
        console.error('Get template error:', error);
        res.status(500).json({ message: 'Failed to get template' });
    }
};
exports.getTemplate = getTemplate;
const getTemplateByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const templates = await server_1.prisma.template.findMany({
            where: {
                category: category,
                isActive: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
        res.json(templates);
    }
    catch (error) {
        console.error('Get templates by category error:', error);
        res.status(500).json({ message: 'Failed to get templates' });
    }
};
exports.getTemplateByCategory = getTemplateByCategory;
//# sourceMappingURL=templateController.js.map