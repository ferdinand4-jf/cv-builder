"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateCV = exports.deleteCV = exports.updateCV = exports.getCV = exports.getCVs = exports.createCV = void 0;
const server_1 = require("../server");
const createCV = async (userId, data) => {
    // Verify template exists
    const template = await server_1.prisma.template.findUnique({
        where: { id: data.templateId },
    });
    if (!template) {
        throw new Error('Template not found');
    }
    const cvData = {
        ...data,
        userId,
        styling: data.styling || template.styles,
    };
    return await server_1.prisma.cV.create({
        data: cvData,
        include: {
            template: true,
        },
    });
};
exports.createCV = createCV;
const getCVs = async (userId) => {
    return await server_1.prisma.cV.findMany({
        where: { userId },
        include: {
            template: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
    });
};
exports.getCVs = getCVs;
const getCV = async (id, userId) => {
    const cv = await server_1.prisma.cV.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            template: true,
        },
    });
    if (!cv) {
        throw new Error('CV not found');
    }
    return cv;
};
exports.getCV = getCV;
const updateCV = async (id, userId, data) => {
    const cv = await server_1.prisma.cV.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!cv) {
        throw new Error('CV not found');
    }
    return await server_1.prisma.cV.update({
        where: { id },
        data,
        include: {
            template: true,
        },
    });
};
exports.updateCV = updateCV;
const deleteCV = async (id, userId) => {
    const cv = await server_1.prisma.cV.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!cv) {
        throw new Error('CV not found');
    }
    await server_1.prisma.cV.delete({
        where: { id },
    });
};
exports.deleteCV = deleteCV;
const duplicateCV = async (id, userId) => {
    const original = await server_1.prisma.cV.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!original) {
        throw new Error('CV not found');
    }
    const { id: _, userId: __, createdAt: ___, updatedAt: ____, ...cvData } = original;
    const duplicateData = {
        ...cvData,
        title: `${original.title} (Copy)`,
        userId,
    };
    return await server_1.prisma.cV.create({
        data: duplicateData,
        include: {
            template: true,
        },
    });
};
exports.duplicateCV = duplicateCV;
//# sourceMappingURL=cvService.js.map