"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err);
    // Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                message: 'A record with this value already exists',
                field: err.meta?.target,
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                message: 'Record not found',
            });
            return;
        }
        if (err.code === 'P2014') {
            res.status(400).json({
                message: 'The operation would violate a foreign key constraint',
            });
            return;
        }
    }
    // Validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            message: 'Validation failed',
            errors: err.errors,
        });
        return;
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        res.status(401).json({
            message: 'Invalid or expired token',
        });
        return;
    }
    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({
            message: 'File too large',
        });
        return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        res.status(400).json({
            message: 'Too many files',
        });
        return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({
            message: 'Unexpected file field',
        });
        return;
    }
    // Default error
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map