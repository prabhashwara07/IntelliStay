"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
class InternalServerError extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.name = 'InternalServerError';
        this.code = 500;
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=internal-server.js.map