"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
class ConflictError extends Error {
    constructor(message = 'Conflict') {
        super(message);
        this.name = 'ConflictError';
        this.code = 409;
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=conflict.js.map