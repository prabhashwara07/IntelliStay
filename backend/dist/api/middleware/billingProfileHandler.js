"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireBillingProfile = void 0;
const BillingProfile_1 = __importDefault(require("../../infrastructure/entities/BillingProfile"));
const errors_1 = require("../../domain/errors");
const express_1 = require("@clerk/express");
const requireBillingProfile = async (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        if (!userId) {
            throw new errors_1.BadRequestError('User ID is required');
        }
        const existingProfile = await BillingProfile_1.default.findOne({ userId, isActive: true });
        if (!existingProfile) {
            throw new errors_1.NotFoundError('Billing profile not found. Please complete your billing profile first.');
        }
        req.billingProfile = existingProfile;
        next();
    }
    catch (error) {
        console.error('Billing profile check error:', error);
        next(error);
    }
};
exports.requireBillingProfile = requireBillingProfile;
exports.default = exports.requireBillingProfile;
//# sourceMappingURL=billingProfileHandler.js.map