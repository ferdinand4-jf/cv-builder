"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
// cast to RequestHandler to satisfy Express typings when middleware returns a Promise
router.use(auth_1.authMiddleware);
router.put('/profile', (0, validation_1.validate)(validators_1.updateProfileValidation), userController_1.updateProfile);
router.post('/change-password', (0, validation_1.validate)(validators_1.changePasswordValidation), userController_1.changePassword);
router.delete('/account', (0, validation_1.validate)(validators_1.deleteAccountValidation), userController_1.deleteAccount);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map