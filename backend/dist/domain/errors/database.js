"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
class DatabaseError extends Error {
    constructor(message = 'Database Error', operation) {
        super(message);
        this.name = 'DatabaseError';
        this.code = 500;
        this.operation = operation;
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=database.js.map