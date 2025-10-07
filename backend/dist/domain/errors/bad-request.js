"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
class BadRequestError extends Error {
    constructor(message = 'Bad Request') {
        super(message);
        this.name = 'BadRequestError';
        this.code = 400;
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=bad-request.js.map