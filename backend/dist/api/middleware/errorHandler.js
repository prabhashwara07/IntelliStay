"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../domain/errors");
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(`${new Date().toISOString()} - Error:`, {
        name: err.name,
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    // Handle custom error classes
    if (err instanceof errors_1.BadRequestError) {
        return res.status(400).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: 400
            }
        });
    }
    if (err instanceof errors_1.UnauthorizedError) {
        return res.status(401).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: 401
            }
        });
    }
    if (err instanceof errors_1.ForbiddenError) {
        return res.status(403).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: 403
            }
        });
    }
    if (err instanceof errors_1.NotFoundError) {
        return res.status(404).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: 404
            }
        });
    }
    if (err instanceof errors_1.ConflictError) {
        return res.status(409).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: 409
            }
        });
    }
    if (err instanceof errors_1.ValidationError) {
        return res.status(422).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                code: 422,
                details: err.errors // Additional validation details
            }
        });
    }
    if (err instanceof errors_1.DatabaseError) {
        return res.status(500).json({
            success: false,
            error: {
                name: err.name,
                message: 'Database operation failed',
                code: 500,
                operation: err.operation
            }
        });
    }
    // Handle MongoDB specific errors
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return res.status(500).json({
            success: false,
            error: {
                name: 'DatabaseError',
                message: 'Database connection error',
                code: 500
            }
        });
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: {
                name: 'UnauthorizedError',
                message: 'Invalid token',
                code: 401
            }
        });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                name: 'UnauthorizedError',
                message: 'Token expired',
                code: 401
            }
        });
    }
    // Handle generic custom errors with code property
    if ('code' in err && typeof err.code === 'number') {
        const customErr = err;
        return res.status(customErr.code).json({
            success: false,
            error: {
                name: customErr.name,
                message: customErr.message,
                code: customErr.code
            }
        });
    }
    // Default to Internal Server Error for unhandled errors
    return res.status(500).json({
        success: false,
        error: {
            name: 'InternalServerError',
            message: process.env.NODE_ENV === 'development'
                ? err.message
                : 'Something went wrong',
            code: 500,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map