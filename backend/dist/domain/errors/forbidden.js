"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
        this.code = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=forbidden.js.map