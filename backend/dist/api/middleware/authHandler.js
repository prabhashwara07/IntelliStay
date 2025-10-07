"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.checkRole = exports.isAuthenticated = exports.ROLES = void 0;
// middleware/auth.js
const express_1 = require("@clerk/express");
exports.ROLES = {
    USER: 'user',
    HOTELOWNER: 'hotelowner',
    ADMIN: 'admin'
};
// For API routes - throws error instead of redirecting
const isAuthenticated = (req, res, next) => {
    const { userId } = (0, express_1.getAuth)(req);
    if (!userId) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
        });
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
// Role checking function
const checkRole = (req, role) => {
    const { sessionClaims } = (0, express_1.getAuth)(req);
    return sessionClaims?.metadata?.role === role;
};
exports.checkRole = checkRole;
// Role-based middleware
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const { sessionClaims, userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userRole = sessionClaims?.metadata?.role || exports.ROLES.USER;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions',
                requiredRoles: allowedRoles,
                currentRole: userRole
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.default = exports.isAuthenticated;
//# sourceMappingURL=authHandler.js.map