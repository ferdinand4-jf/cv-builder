"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = void 0;
const toUserResponse = (user) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.toUserResponse = toUserResponse;
//# sourceMappingURL=User.js.map