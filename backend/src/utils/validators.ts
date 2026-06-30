import { body } from 'express-validator'

// Auth validators
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
]

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

export const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
]

export const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
]

// CV validators
export const createCVValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('templateId')
    .notEmpty()
    .withMessage('Template ID is required')
    .isUUID()
    .withMessage('Invalid template ID'),
  body('personalInfo')
    .isObject()
    .withMessage('Personal info must be an object'),
  body('experience')
    .isArray()
    .withMessage('Experience must be an array'),
  body('education')
    .isArray()
    .withMessage('Education must be an array'),
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
]

export const updateCVValidation = [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('templateId')
    .optional()
    .isUUID()
    .withMessage('Invalid template ID'),
  body('personalInfo')
    .optional()
    .isObject()
    .withMessage('Personal info must be an object'),
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
]

// User validators
export const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
]

export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
]

export const deleteAccountValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

// Admin validators
export const updateUserValidation = [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Role must be USER or ADMIN'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
]

export const createTemplateValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .isIn(['MODERN', 'CLASSIC', 'ATS_FRIENDLY', 'CREATIVE'])
    .withMessage('Invalid category'),
  body('thumbnail')
    .notEmpty()
    .withMessage('Thumbnail URL is required')
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('styles')
    .isObject()
    .withMessage('Styles must be an object'),
]

export const updateTemplateValidation = [
  body('name')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['MODERN', 'CLASSIC', 'ATS_FRIENDLY', 'CREATIVE'])
    .withMessage('Invalid category'),
  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('styles')
    .optional()
    .isObject()
    .withMessage('Styles must be an object'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('isPremium')
    .optional()
    .isBoolean()
    .withMessage('isPremium must be a boolean'),
]