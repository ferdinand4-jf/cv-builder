"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.server = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("./server");
const server_2 = require("./server");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return server_2.prisma; } });
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await server_2.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await server_2.prisma.$disconnect();
    process.exit(0);
});
// Start server
const server = server_1.app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API available at http://localhost:${PORT}/api`);
    console.log(`❤️  Health check at http://localhost:${PORT}/health`);
});
exports.server = server;
//# sourceMappingURL=index.js.map