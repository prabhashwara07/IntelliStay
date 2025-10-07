"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authHandler_1 = require("./middleware/authHandler");
const admin_1 = require("../application/admin");
const AdminRouter = (0, express_1.Router)();
AdminRouter.get('/hotel-requests', authHandler_1.isAuthenticated, (0, authHandler_1.requireRole)([authHandler_1.ROLES.ADMIN]), admin_1.getHotelRequests);
AdminRouter.put('/approve/:id', authHandler_1.isAuthenticated, (0, authHandler_1.requireRole)([authHandler_1.ROLES.ADMIN]), admin_1.approveHotelRequest);
AdminRouter.put('/reject/:id', authHandler_1.isAuthenticated, (0, authHandler_1.requireRole)([authHandler_1.ROLES.ADMIN]), admin_1.rejectHotelRequest);
exports.default = AdminRouter;
//# sourceMappingURL=admin.js.map