"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_1.validate)(validators_1.registerValidation), authController_1.register);
router.post('/login', (0, validation_1.validate)(validators_1.loginValidation), authController_1.login);
router.post('/refresh', authController_1.refreshToken);
router.post('/logout', authController_1.logout);
router.post('/forgot-password', (0, validation_1.validate)(validators_1.forgotPasswordValidation), authController_1.forgotPassword);
router.post('/reset-password', (0, validation_1.validate)(validators_1.resetPasswordValidation), authController_1.resetPassword);
// cast middleware to any to satisfy express RequestHandler typing mismatch
router.get('/me', auth_1.authMiddleware, authController_1.getMe);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map