"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cvController_1 = require("../controllers/cvController");
const auth_1 = require("../middlewares/auth");
const validation_1 = require("../middlewares/validation");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', cvController_1.getCVs);
router.post('/', (0, validation_1.validate)(validators_1.createCVValidation), cvController_1.createCV);
router.get('/:id', cvController_1.getCV);
router.put('/:id', (0, validation_1.validate)(validators_1.updateCVValidation), cvController_1.updateCV);
router.delete('/:id', cvController_1.deleteCV);
router.post('/:id/duplicate', cvController_1.duplicateCV);
router.get('/:id/pdf', cvController_1.generateCVPDF);
exports.default = router;
//# sourceMappingURL=cvRoutes.js.map