"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message = 'Validation Error', errors) {
        super(message);
        this.name = 'ValidationError';
        this.code = 422;
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation.js.map