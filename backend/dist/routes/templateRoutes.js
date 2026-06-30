"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const templateController_1 = require("../controllers/templateController");
const router = (0, express_1.Router)();
router.get('/', templateController_1.getTemplates);
router.get('/category/:category', templateController_1.getTemplateByCategory);
router.get('/:id', templateController_1.getTemplate);
exports.default = router;
//# sourceMappingURL=templateRoutes.js.map