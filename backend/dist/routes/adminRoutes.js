"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
const toRequestHandler = (handler) => handler;
// User management
router.get('/users', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), toRequestHandler(adminController_1.getUsers));
router.get('/users/:id', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), toRequestHandler(adminController_1.getUser));
router.put('/users/:id', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), (0, validation_1.validate)(validators_1.updateUserValidation), toRequestHandler(adminController_1.updateUser));
router.delete('/users/:id', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), toRequestHandler(adminController_1.deleteUser));
// Template management
router.post('/templates', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), (0, validation_1.validate)(validators_1.createTemplateValidation), toRequestHandler(adminController_1.createTemplate));
router.put('/templates/:id', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), (0, validation_1.validate)(validators_1.updateTemplateValidation), toRequestHandler(adminController_1.updateTemplate));
router.delete('/templates/:id', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), toRequestHandler(adminController_1.deleteTemplate));
// Statistics
router.get('/statistics', toRequestHandler(auth_1.authMiddleware), toRequestHandler(auth_1.adminMiddleware), toRequestHandler(adminController_1.getStatistics));
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map