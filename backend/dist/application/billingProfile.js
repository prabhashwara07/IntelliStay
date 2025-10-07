"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillingProfileByUserId = exports.createOrUpdateBillingProfile = void 0;
const express_1 = require("@clerk/express");
const BillingProfile_1 = __importDefault(require("../infrastructure/entities/BillingProfile"));
const BiliingProfileDTO_1 = require("../domain/dtos/BiliingProfileDTO");
const errors_1 = require("../domain/errors");
const createOrUpdateBillingProfile = async (req, res) => {
    const validatedData = BiliingProfileDTO_1.CreateBillingProfileDTO.parse(req.body);
    const existingProfile = await BillingProfile_1.default.findOne({
        userId: validatedData.userId,
        isActive: true
    });
    let savedProfile;
    let isUpdate = false;
    if (existingProfile) {
        savedProfile = await BillingProfile_1.default.findOneAndUpdate({ userId: validatedData.userId, isActive: true }, { ...validatedData }, { new: true, runValidators: true });
        isUpdate = true;
    }
    else {
        const newBillingProfile = new BillingProfile_1.default(validatedData);
        savedProfile = await newBillingProfile.save();
    }
    const profileJson = savedProfile.toJSON();
    const responseData = {
        mobile: profileJson.mobile,
        address: profileJson.address,
        city: profileJson.city,
        country: profileJson.country,
        currency: profileJson.currency,
    };
    const validatedResponse = BiliingProfileDTO_1.BillingProfileResponseDTO.parse(responseData);
    res.status(isUpdate ? 200 : 201).json({
        success: true,
        message: `Billing profile ${isUpdate ? 'updated' : 'created'} successfully`,
        data: validatedResponse
    });
};
exports.createOrUpdateBillingProfile = createOrUpdateBillingProfile;
const getBillingProfileByUserId = async (req, res) => {
    const userId = (0, express_1.getAuth)(req).userId;
    // Find the billing profile
    const billingProfile = await BillingProfile_1.default.findOne({
        userId,
        isActive: true
    });
    if (!billingProfile) {
        throw new errors_1.NotFoundError('Billing profile not found for this user');
    }
    const profileJson = billingProfile.toJSON();
    const responseData = {
        mobile: profileJson.mobile,
        address: profileJson.address,
        city: profileJson.city,
        country: profileJson.country,
        currency: profileJson.currency,
    };
    const validatedResponse = BiliingProfileDTO_1.BillingProfileResponseDTO.parse(responseData);
    res.status(200).json({
        success: true,
        message: 'Billing profile retrieved successfully',
        data: validatedResponse
    });
};
exports.getBillingProfileByUserId = getBillingProfileByUserId;
//# sourceMappingURL=billingProfile.js.map