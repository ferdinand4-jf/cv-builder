"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplateValidation = exports.createTemplateValidation = exports.updateUserValidation = exports.deleteAccountValidation = exports.changePasswordValidation = exports.updateProfileValidation = exports.updateCVValidation = exports.createCVValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
// Auth validators
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    (0, express_validator_1.body)('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
exports.forgotPasswordValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
];
// CV validators
exports.createCVValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    (0, express_validator_1.body)('templateId')
        .notEmpty()
        .withMessage('Template ID is required')
        .isUUID()
        .withMessage('Invalid template ID'),
    (0, express_validator_1.body)('personalInfo')
        .isObject()
        .withMessage('Personal info must be an object'),
    (0, express_validator_1.body)('experience')
        .isArray()
        .withMessage('Experience must be an array'),
    (0, express_validator_1.body)('education')
        .isArray()
        .withMessage('Education must be an array'),
    (0, express_validator_1.body)('skills')
        .isArray()
        .withMessage('Skills must be an array'),
];
exports.updateCVValidation = [
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    (0, express_validator_1.body)('templateId')
        .optional()
        .isUUID()
        .withMessage('Invalid template ID'),
    (0, express_validator_1.body)('personalInfo')
        .optional()
        .isObject()
        .withMessage('Personal info must be an object'),
    (0, express_validator_1.body)('experience')
        .optional()
        .isArray()
        .withMessage('Experience must be an array'),
    (0, express_validator_1.body)('education')
        .optional()
        .isArray()
        .withMessage('Education must be an array'),
    (0, express_validator_1.body)('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
];
// User validators
exports.updateProfileValidation = [
    (0, express_validator_1.body)('firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
];
exports.changePasswordValidation = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
];
exports.deleteAccountValidation = [
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
// Admin validators
exports.updateUserValidation = [
    (0, express_validator_1.body)('firstName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['USER', 'ADMIN'])
        .withMessage('Role must be USER or ADMIN'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
];
exports.createTemplateValidation = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    (0, express_validator_1.body)('category')
        .isIn(['MODERN', 'CLASSIC', 'ATS_FRIENDLY', 'CREATIVE'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('thumbnail')
        .notEmpty()
        .withMessage('Thumbnail URL is required')
        .isURL()
        .withMessage('Thumbnail must be a valid URL'),
    (0, express_validator_1.body)('styles')
        .isObject()
        .withMessage('Styles must be an object'),
];
exports.updateTemplateValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['MODERN', 'CLASSIC', 'ATS_FRIENDLY', 'CREATIVE'])
        .withMessage('Invalid category'),
    (0, express_validator_1.body)('thumbnail')
        .optional()
        .isURL()
        .withMessage('Thumbnail must be a valid URL'),
    (0, express_validator_1.body)('styles')
        .optional()
        .isObject()
        .withMessage('Styles must be an object'),
    (0, express_validator_1.body)('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean'),
    (0, express_validator_1.body)('isPremium')
        .optional()
        .isBoolean()
        .withMessage('isPremium must be a boolean'),
];
//# sourceMappingURL=validators.js.map