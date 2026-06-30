"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateCV = exports.generateCVPDF = exports.deleteCV = exports.updateCV = exports.getCV = exports.getCVs = exports.createCV = void 0;
const server_1 = require("../server");
const pdfService_1 = require("../services/pdfService");
const createCV = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { title, templateId, personalInfo, experience, education, skills, languages, certifications, projects, customSections, styling, isPublic, } = req.body;
        // Verify template exists
        const template = await server_1.prisma.template.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        const cv = await server_1.prisma.cV.create({
            data: {
                userId: req.user.id,
                templateId,
                title,
                personalInfo: personalInfo || {},
                experience: experience || [],
                education: education || [],
                skills: skills || [],
                languages: languages || [],
                certifications: certifications || [],
                projects: projects || [],
                customSections: customSections || [],
                styling: styling || template.styles,
                isPublic: isPublic || false,
            },
            include: {
                template: true,
            },
        });
        res.status(201).json(cv);
    }
    catch (error) {
        console.error('Create CV error:', error);
        res.status(500).json({ message: 'Failed to create CV' });
    }
};
exports.createCV = createCV;
const getCVs = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const cvs = await server_1.prisma.cV.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                template: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        res.json(cvs);
    }
    catch (error) {
        console.error('Get CVs error:', error);
        res.status(500).json({ message: 'Failed to get CVs' });
    }
};
exports.getCVs = getCVs;
const getCV = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { id } = req.params;
        const cv = await server_1.prisma.cV.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
            include: {
                template: true,
            },
        });
        if (!cv) {
            res.status(404).json({ message: 'CV not found' });
            return;
        }
        res.json(cv);
    }
    catch (error) {
        console.error('Get CV error:', error);
        res.status(500).json({ message: 'Failed to get CV' });
    }
};
exports.getCV = getCV;
const updateCV = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { id } = req.params;
        const updates = req.body;
        const cv = await server_1.prisma.cV.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });
        if (!cv) {
            res.status(404).json({ message: 'CV not found' });
            return;
        }
        const updatedCV = await server_1.prisma.cV.update({
            where: { id },
            data: updates,
            include: {
                template: true,
            },
        });
        res.json(updatedCV);
    }
    catch (error) {
        console.error('Update CV error:', error);
        res.status(500).json({ message: 'Failed to update CV' });
    }
};
exports.updateCV = updateCV;
const deleteCV = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { id } = req.params;
        const cv = await server_1.prisma.cV.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });
        if (!cv) {
            res.status(404).json({ message: 'CV not found' });
            return;
        }
        await server_1.prisma.cV.delete({
            where: { id },
        });
        res.json({ message: 'CV deleted successfully' });
    }
    catch (error) {
        console.error('Delete CV error:', error);
        res.status(500).json({ message: 'Failed to delete CV' });
    }
};
exports.deleteCV = deleteCV;
const generateCVPDF = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { id } = req.params;
        const cv = await server_1.prisma.cV.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
            include: {
                template: true,
            },
        });
        if (!cv) {
            res.status(404).json({ message: 'CV not found' });
            return;
        }
        const pdfBuffer = await (0, pdfService_1.generatePDF)(cv);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=cv-${cv.title}.pdf`);
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error('Generate PDF error:', error);
        res.status(500).json({ message: 'Failed to generate PDF' });
    }
};
exports.generateCVPDF = generateCVPDF;
const duplicateCV = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { id } = req.params;
        const original = await server_1.prisma.cV.findFirst({
            where: {
                id,
                userId: req.user.id,
            },
        });
        if (!original) {
            res.status(404).json({ message: 'CV not found' });
            return;
        }
        // Remove id, userId, createdAt, updatedAt from original
        const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...cvData } = original;
        const duplicated = await server_1.prisma.cV.create({
            data: {
                title: `${original.title} (Copy)`,
                userId: req.user.id,
                templateId: cvData.templateId,
                personalInfo: cvData.personalInfo || {},
                experience: cvData.experience || [],
                education: cvData.education || [],
                skills: cvData.skills || [],
                languages: cvData.languages || [],
                certifications: cvData.certifications || [],
                projects: cvData.projects || [],
                customSections: cvData.customSections || [],
                styling: cvData.styling || {},
                isPublic: cvData.isPublic || false,
            },
            include: {
                template: true,
            },
        });
        res.status(201).json(duplicated);
    }
    catch (error) {
        console.error('Duplicate CV error:', error);
        res.status(500).json({ message: 'Failed to duplicate CV' });
    }
};
exports.duplicateCV = duplicateCV;
//# sourceMappingURL=cvController.js.map